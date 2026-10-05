"""Parse local SVGs without fetching entities; reject active/external content."""
import json,sys,re,xml.etree.ElementTree as ET
errors=[]
for item in json.load(sys.stdin):
 try:
  raw=open(item['path'],encoding='utf8').read()
  if re.search(r'<!DOCTYPE|<!ENTITY',raw,re.I): raise ValueError('DTD/entities forbidden')
  root=ET.fromstring(raw)
  if root.tag!='{http://www.w3.org/2000/svg}svg': raise ValueError('not an SVG root')
  view=[float(x) for x in root.get('viewBox','').split()]
  if view!=[0,0,item['width'],item['height']]: raise ValueError('viewBox differs from catalog dimensions')
  for el in root.iter():
   if el.tag.split('}')[-1] in ['script','style','foreignObject','animate','animateTransform','set']: raise ValueError('active SVG element forbidden')
   for key,val in el.attrib.items():
    name=key.split('}')[-1].lower()
    if name.startswith('on') or (name=='href' and not val.startswith('#')): raise ValueError('active or external attribute forbidden')
    if re.search(r'url\(\s*[\'\"]?(?!#)[a-z]+:|@import',val,re.I): raise ValueError('external CSS forbidden')
 except Exception as exc: errors.append(f"{item['path']}: {exc}")
if errors: print('\n'.join(errors));sys.exit(1)
