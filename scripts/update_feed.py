"""womencore SNS 피드 모으기 — GitHub Actions가 매일 실행해 assets/feed.json을 갱신해요."""
import json, os, re, urllib.request, xml.etree.ElementTree as ET
from datetime import datetime, timezone

BEHOLD_URL = os.environ.get("BEHOLD_URL", "").strip()          # 인스타그램 (Behold JSON 피드 주소)
YOUTUBE_ID = os.environ.get("YOUTUBE_CHANNEL_ID", "").strip()  # 유튜브 채널 ID (UC로 시작)
NAVER_BLOG = os.environ.get("NAVER_BLOG_ID", "").strip()       # 네이버 블로그 아이디
PER_SOURCE = 6

def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 womencore-feed"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()

def clean(text, n=60):
    text = re.sub(r"<[^>]+>", " ", text or "")
    text = re.sub(r"#\S+", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text[:n] + ("…" if len(text) > n else "")

items = []

if BEHOLD_URL:
    try:
        data = json.loads(get(BEHOLD_URL))
        for p in data.get("posts", [])[:PER_SOURCE]:
            sizes = p.get("sizes") or {}
            img = (sizes.get("medium") or {}).get("mediaUrl") or p.get("thumbnailUrl") or p.get("mediaUrl")
            items.append({"source": "instagram", "date": p.get("timestamp"), "url": p.get("permalink"),
                          "title": clean(p.get("prunedCaption") or p.get("caption")), "image": img})
    except Exception as e:
        print("instagram 실패:", e)

if YOUTUBE_ID:
    try:
        ns = {"a": "http://www.w3.org/2005/Atom", "yt": "http://www.youtube.com/xml/schemas/2015", "media": "http://search.yahoo.com/mrss/"}
        root = ET.fromstring(get(f"https://www.youtube.com/feeds/videos.xml?channel_id={YOUTUBE_ID}"))
        for e in root.findall("a:entry", ns)[:PER_SOURCE]:
            vid = e.findtext("yt:videoId", namespaces=ns)
            items.append({"source": "youtube", "date": e.findtext("a:published", namespaces=ns),
                          "url": f"https://www.youtube.com/watch?v={vid}", "title": clean(e.findtext("a:title", namespaces=ns)),
                          "image": f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg"})
    except Exception as e:
        print("youtube 실패:", e)

if NAVER_BLOG:
    try:
        from email.utils import parsedate_to_datetime
        root = ET.fromstring(get(f"https://rss.blog.naver.com/{NAVER_BLOG}.xml"))
        for it in root.findall("./channel/item")[:PER_SOURCE]:
            d = parsedate_to_datetime(it.findtext("pubDate")).astimezone(timezone.utc).isoformat()
            items.append({"source": "blog", "date": d, "url": it.findtext("link"), "title": clean(it.findtext("title")), "image": ""})
    except Exception as e:
        print("blog 실패:", e)

def norm(d):
    try:
        return datetime.fromisoformat(d.replace("Z", "+00:00").replace("+0000", "+00:00")).astimezone(timezone.utc).isoformat()
    except Exception:
        return None
for i in items:
    i["date"] = norm(i.get("date") or "")
items = [i for i in items if i.get("date")]
items.sort(key=lambda i: i["date"], reverse=True)
out = {"updated": datetime.now(timezone.utc).isoformat(), "items": items[:12]}
if items:
    with open("assets/feed.json", "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    print(len(items), "개 저장")
else:
    print("가져온 게시물이 없어 기존 파일을 유지해요")
