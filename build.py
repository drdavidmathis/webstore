"""Copy settings.csv and products.csv into index.html as fallback data.
Optional: run after editing the CSVs if you want the fallback to match.
Usage: python3 build.py
"""
import re, pathlib
root = pathlib.Path(__file__).parent
html = (root / "index.html").read_text(encoding="utf-8")
for tag, name in (("fallback-settings", "settings.csv"), ("fallback-products", "products.csv")):
    data = (root / name).read_text(encoding="utf-8").replace("</script", "<\\/script")
    html = re.sub(r'(<script type="text/csv" id="%s">)(.*?)(</script>)' % tag,
                  lambda m: m.group(1) + "\n" + data + m.group(3), html, flags=re.S)
(root / "index.html").write_text(html, encoding="utf-8")
print("Fallback data updated in index.html")
