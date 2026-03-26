"""Deeper HTML structure exploration for xistarca.pt listing."""
import httpx
from bs4 import BeautifulSoup
import re

def explore_listing_cards():
    r = httpx.get("https://xistarca.pt/eventos", follow_redirects=True, timeout=30,
                  headers={"User-Agent": "Mozilla/5.0"})
    soup = BeautifulSoup(r.text, "lxml")

    # Find the event-list container
    event_list = soup.select_one(".event-list")
    if event_list:
        print("=== EVENT-LIST RAW HTML ===")
        print(str(event_list)[:5000])

    # All elements with class containing 'event'
    print("\n=== ALL CLASSES WITH 'event' ===")
    for el in soup.find_all(True, class_=True):
        classes = el.get('class', [])
        for c in classes:
            if 'event' in c.lower():
                text = el.get_text(strip=True)[:60]
                print(f"  <{el.name} class='{c}'> {text}")
                break

def explore_detail_deeper():
    r = httpx.get("https://xistarca.pt/eventos/corrida-solidaria-exide-suanfarma-e-hit-2026",
                  follow_redirects=True, timeout=30,
                  headers={"User-Agent": "Mozilla/5.0"})
    soup = BeautifulSoup(r.text, "lxml")

    # Find article or main content
    print("\n=== ARTICLE / MAIN CONTENT ===")
    article = soup.select_one("article")
    if article:
        print(f"  article id={article.get('id','')} class={article.get('class',[])}")

    # The intro description
    print("\n=== INTRO DESCRIPTION ===")
    h1 = soup.select_one("h1")
    if h1:
        # Get all paragraphs after h1 until first h3
        parent = h1.parent
        if parent:
            for p in parent.find_all("p"):
                text = p.get_text(strip=True)
                if text and len(text) > 20:
                    print(f"  {text[:150]}")
                    break

    # More precise - the content div after <h1> before first <h3>
    print("\n=== CONTENT BEFORE FIRST H3 ===")
    first_h3 = soup.select_one("h3")
    if h1 and first_h3:
        # Get all elements between h1 and first h3
        current = h1.find_next()
        while current and current != first_h3:
            if current.name == "p":
                text = current.get_text(strip=True)
                if text and len(text) > 20:
                    print(f"  <p> {text[:200]}")
            current = current.find_next()

    # The post_content  / entry-content area
    print("\n=== POST_CONTENT CLASS ===")
    post = soup.select_one(".post_content, .entry-content")
    if post:
        for child in post.find_all(True, recursive=False)[:5]:
            cclass = ' '.join(child.get('class', []))
            text = child.get_text(strip=True)[:80]
            print(f"  <{child.name} class='{cclass}'> {text}")

    # og:meta tags
    print("\n=== OG META TAGS ===")
    for meta in soup.select("meta[property^='og:']"):
        prop = meta.get("property", "")
        content = meta.get("content", "")[:120]
        print(f"  {prop}: {content}")

    # The distance section raw HTML
    print("\n=== DISTÂNCIA SECTION RAW ===")
    dist_h3 = soup.find("h3", string=re.compile(r"DIST[AÂ]NCIA", re.I))
    if dist_h3:
        parent_div = dist_h3.parent
        if parent_div:
            print(str(parent_div)[:2000])

    # Registration pricing images
    print("\n=== PRICING IMAGES ===")
    for img in soup.find_all("img"):
        alt = img.get("alt", "").lower()
        src = img.get("src", "")
        if any(k in alt for k in ["inscri", "preco", "price", "botao", "valor"]):
            print(f"  alt='{img.get('alt','')}' src='{src}'")

    # wp-post-image
    print("\n=== WP-POST-IMAGE ===")
    for img in soup.select(".wp-post-image, .post-thumbnail img"):
        print(f"  src={img.get('src','')}")

explore_listing_cards()
explore_detail_deeper()
