#!/usr/bin/env python3
"""Fetch reference photos from Wikimedia Commons for study (never shipped: reference/ is git-ignored).

Usage: python tools/fetch_refs.py <out dir> <count> "<search query>" ["<second query>" ...]

Searches Commons for files matching each query, downloads up to <count> JPEG/PNG photos (1600 px wide at most)
into <out dir>, and appends an entry per photo to <out dir>/sources.txt with the file page URL, licence and author.
Files already listed in sources.txt are skipped, so it can be run again with other queries.
"""
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request

API = 'https://commons.wikimedia.org/w/api.php'
UA = 'F1FocusReferenceFetcher/1.0 (personal project; study references)'


def api(params):
    url = API + '?' + urllib.parse.urlencode({**params, 'format': 'json'})
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r)


def search(query, limit):
    data = api({
        'action': 'query', 'generator': 'search', 'gsrsearch': query, 'gsrnamespace': 6, 'gsrlimit': limit * 4,
        'prop': 'imageinfo', 'iiprop': 'url|extmetadata|size|mime', 'iiurlwidth': 1600,
    })
    pages = data.get('query', {}).get('pages', {})
    out = []
    for p in sorted(pages.values(), key=lambda p: p.get('index', 0)):
        info = (p.get('imageinfo') or [{}])[0]
        if info.get('mime') not in ('image/jpeg', 'image/png'):
            continue
        if info.get('width', 0) < 800:
            continue
        meta = info.get('extmetadata', {})
        out.append({
            'title': p['title'],
            'page': info.get('descriptionurl'),
            'thumb': info.get('thumburl') or info.get('url'),
            'license': meta.get('LicenseShortName', {}).get('value', '?'),
            'license_url': meta.get('LicenseUrl', {}).get('value', ''),
            'artist': re.sub('<[^>]+>', '', meta.get('Artist', {}).get('value', '?')).strip(),
            'desc': re.sub('<[^>]+>', '', meta.get('ImageDescription', {}).get('value', '')).strip()[:160],
            'size': f"{info.get('width')}x{info.get('height')}",
        })
    return out


def main():
    out_dir, count, queries = sys.argv[1], int(sys.argv[2]), sys.argv[3:]
    os.makedirs(out_dir, exist_ok=True)
    sources = os.path.join(out_dir, 'sources.txt')
    have = open(sources, encoding='utf-8').read() if os.path.exists(sources) else ''
    saved = 0
    with open(sources, 'a', encoding='utf-8') as log:
        if not have:
            log.write('Reference photos from Wikimedia Commons, for study only. Never shipped in the app.\n\n')
        for query in queries:
            try:
                results = search(query, count)
            except Exception as e:  # noqa: BLE001
                print('search failed:', query, e)
                continue
            for r in results:
                if saved >= count:
                    break
                if r['page'] in have:
                    continue
                name = re.sub(r'[^A-Za-z0-9]+', '-', r['title'].replace('File:', '')).strip('-')[:60]
                ext = '.png' if r['thumb'].lower().endswith('.png') else '.jpg'
                path = os.path.join(out_dir, f'{saved + 1:02d}-{name}{ext}')
                time.sleep(2)  # Commons rate-limits bursts of downloads (HTTP 429)
                try:
                    req = urllib.request.Request(r['thumb'], headers={'User-Agent': UA})
                    with urllib.request.urlopen(req, timeout=120) as resp, open(path, 'wb') as f:
                        f.write(resp.read())
                except Exception as e:  # noqa: BLE001
                    print('download failed:', r['thumb'], e)
                    continue
                log.write(f"{os.path.basename(path)}\n  query:   {query}\n  page:    {r['page']}\n  license: {r['license']} {r['license_url']}\n  author:  {r['artist']}\n  note:    {r['desc']}\n  original size: {r['size']} (saved at most 1600 px wide)\n\n")
                have += r['page']
                saved += 1
                print('saved', path, r['license'])
            if saved >= count:
                break
    print(f'{saved} photos in {out_dir}')


if __name__ == '__main__':
    main()
