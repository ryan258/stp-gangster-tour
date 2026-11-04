import {describe,it,expect} from 'vitest';
import {rootRelativeEscapes} from '../../scripts/check-base.mjs';
describe('Subpath guard',()=>{
 const html='<a href="/stp/map/">ok</a><a href="/map/">bad</a><img src="/stp/a.webp" srcset="/stp/a-640.webp 640w, /a.webp 1376w"><a href="//cdn.example/x">x</a><a href="https://x.y/z">y</a><a href="#top">t</a><b data-narration-src="/media/a.mp3"></b>';
 it('flags root-relative URLs outside the base, in attributes, srcset and CSS',()=>{
  expect(rootRelativeEscapes(html+'<i style="background:url(/fonts/f.woff2)"></i>','/stp')).toEqual(['/map/','/a.webp','/media/a.mp3','/fonts/f.woff2']);
 });
 it('accepts the base itself, with or without a trailing slash',()=>{
  expect(rootRelativeEscapes('<a href="/stp">a</a><a href="/stp/">b</a>','/stp/')).toEqual([]);
  expect(rootRelativeEscapes('<a href="/">home</a>','/stp')).toEqual(['/']);
 });
});
