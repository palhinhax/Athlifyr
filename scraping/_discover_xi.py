"""Explore xistarca.pt HTML structure for scraping."""
import httpx
from bs4 import BeautifulSoup
import json
import re

def explore_listing():
    r = httpx.get("https://xistarca.pt/eventos", follow_redirects=True, timeout=30,
                  headers={"User-Agent": "Mozilla/5.0"})
    soup = BeautifulSoup(r.text, "lxml")

    print("=== EVENT LINKS ===")
    seen = set()
    for a in soup.select("a[href*='/eventos/']"):
        href = a.get("href", "")
        if href != "https://xistarca.pt/eventos" and href not in seen:
            seen.add(href)
            text = a.get_text(strip=True)[:80]
            parent = a.parent
            pclass = ' '.join(parent.get('class', [])) if parent else ''
            print(f"  {href} -> '{text}' in <{parent.name if parent else '?'} class='{pclass}'>")
    print(f"  Total unique: {len(seen)}")

    # Find the event card structure
    print("\n=== EVENT CARDS STRUCTURE ===")
    # Try various containers
    for sel in ["article", ".event", ".evento", ".post", ".entry", ".card"]:
        found = soup.select(sel)
        if found:
            print(f"  Found {len(found)} '{sel}'")

    # Look for h2 headings (event titles from the fetch)
    print("\n=== H2 TAGS (event titles) ===")
    for h2 in soup.select("h2"):
        text = h2.get_text(strip=True)[:60]
        parent = h2.parent
        pclass = ' '.join(parent.get('class', [])) if parent else ''
        link = h2.find("a")
        href = link.get("href", "") if link else "no link"
        print(f"  '{text}' -> {href} | parent: <{parent.name if parent else '?'} class='{pclass}'>")

    # Print first event card raw HTML
    print("\n=== FIRST EVENT CARD RAW HTML ===")
    # Look for elements containing event dates like "DE ABRIL"
    event_containers = []
    for el in soup.find_all(string=re.compile(r"\d+ DE \w+", re.I)):
        p = el.find_parent("div", class_=True) or el.find_parent("article")
        if p and p not in event_containers:
            event_containers.append(p)
    for i, ec in enumerate(event_containers[:2]):
        print(f"\n--- Container {i} ---")
        print(f"  tag={ec.name} class={ec.get('class', [])}")
        print(str(ec)[:1500])

    # Check for "PRÓXIMOS EVENTOS" section
    print("\n=== LOOKING FOR SECTION CONTAINER ===")
    prox = soup.find(string=re.compile(r"PR[OÓ]XIMOS EVENTOS", re.I))
    if prox:
        section = prox.find_parent("section") or prox.find_parent("div", class_=True)
        if section:
            classes = ' '.join(section.get('class', []))
            print(f"  Container: <{section.name} class='{classes}'>")
            # Children structure
            for child in section.find_all(True, recursive=False):
                cclass = ' '.join(child.get('class', []))
                text = child.get_text(strip=True)[:60]
                print(f"    <{child.name} class='{cclass}'> {text}")


def explore_detail():
    r = httpx.get("https://xistarca.pt/eventos/corrida-solidaria-exide-suanfarma-e-hit-2026",
                  follow_redirects=True, timeout=30,
                  headers={"User-Agent": "Mozilla/5.0"})
    soup = BeautifulSoup(r.text, "lxml")

    print("\n\n========== DETAIL PAGE ==========")

    # Title
    h1 = soup.select_one("h1")
    print(f"\n=== TITLE ===")
    print(f"  h1: '{h1.get_text(strip=True) if h1 else 'N/A'}'")
    if h1:
        print(f"  h1 class: {h1.get('class', [])}")

    # Hero image
    print("\n=== HERO IMAGE ===")
    hero_img = soup.select_one(".post-thumbnail img, .entry-thumbnail img, .wp-post-image")
    if hero_img:
        print(f"  src: {hero_img.get('src', '')}")
    # Check for og:image
    og_img = soup.find("meta", property="og:image")
    if og_img:
        print(f"  og:image: {og_img.get('content', '')}")

    # Main content area
    print("\n=== CONTENT SECTIONS (h3 headings) ===")
    for h3 in soup.select("h3"):
        text = h3.get_text(strip=True)[:60]
        parent = h3.parent
        pclass = ' '.join(parent.get('class', [])) if parent else ''
        print(f"  h3: '{text}' in <{parent.name if parent else '?'} class='{pclass}'>")

    # Distance/Time/Location section
    print("\n=== DISTÂNCIA / HORA / LOCAL section ===")
    dist_h3 = soup.find("h3", string=re.compile(r"DIST[AÂ]NCIA", re.I))
    if dist_h3:
        # Get the content after this heading
        next_sibs = []
        sib = dist_h3.find_next_sibling()
        while sib and sib.name != "h3":
            text = sib.get_text(strip=True)
            if text:
                next_sibs.append(text)
            sib = sib.find_next_sibling()
        for s in next_sibs[:10]:
            print(f"  {s[:120]}")

    # Google Maps links
    print("\n=== GOOGLE MAPS LINKS ===")
    for a in soup.find_all("a", href=lambda h: h and ("maps.app.goo.gl" in str(h) or "google.com/maps" in str(h) or "goo.gl/maps" in str(h))):
        print(f"  {a['href']} -> '{a.get_text(strip=True)[:60]}'")

    # Regulation/PDF links
    print("\n=== PDF/REGULATION LINKS ===")
    for a in soup.find_all("a", href=lambda h: h and (".pdf" in str(h).lower() or "regulamento" in str(h).lower())):
        text = a.get_text(strip=True)[:60]
        print(f"  {a['href']} -> '{text}'")

    # Checkout registration link
    print("\n=== REGISTRATION LINKS ===")
    for a in soup.find_all("a", href=lambda h: h and ("checkout" in str(h).lower() or "inscrição" in str(h).lower() or "plataforma" in str(h).lower())):
        print(f"  {a['href']} -> '{a.get_text(strip=True)[:60]}'")

    # JSON-LD
    print("\n=== JSON-LD ===")
    for script in soup.select("script[type='application/ld+json']"):
        try:
            data = json.loads(script.string)
            print(f"  {json.dumps(data, indent=2)[:500]}")
        except:
            pass

    # Description - first paragraphs before h3s
    print("\n=== INTRO TEXT (before first h3) ===")
    content = soup.select_one(".entry-content, .post-content, article, main")
    if content:
        for p in content.find_all("p")[:5]:
            text = p.get_text(strip=True)[:120]
            if text:
                print(f"  {text}")

    # Pricing section
    print("\n=== INSCRIÇÕES SECTION ===")
    insc_h3 = soup.find("h3", string=re.compile(r"INSCRI[ÇC][ÕO]ES", re.I))
    if insc_h3:
        sib = insc_h3.find_next_sibling()
        while sib and sib.name != "h3":
            text = sib.get_text(strip=True)
            if text and len(text) > 3:
                print(f"  {text[:150]}")
            # Look for pricing images/tables
            imgs = sib.find_all("img") if hasattr(sib, 'find_all') else []
            for img in imgs:
                src = img.get("src", "")
                alt = img.get("alt", "")
                print(f"  IMG: alt='{alt}' src='{src[:80]}'")
            sib = sib.find_next_sibling()

    # Look for date in specific elements
    print("\n=== DATE PATTERN ===")
    date_texts = soup.find_all(string=re.compile(r"\d{1,2}\s+(?:DE\s+)?\w+\s+\d{4}", re.I))
    for dt in date_texts[:5]:
        print(f"  '{str(dt).strip()[:80]}'")

    # Slider/hero section at top 
    print("\n=== TOP SLIDER/HERO ===")
    slider = soup.select_one(".rev_slider, .slider, .hero, .banner, [class*='slider']")
    if slider:
        classes = ' '.join(slider.get('class', []))
        print(f"  Found: <{slider.name} class='{classes}'>")
        for img in slider.find_all("img")[:3]:
            print(f"  IMG: {img.get('src', '')[:80]}")

explore_listing()
explore_detail()
