# Saint Paul After Dark brand and marketing kit

**Start with [the visual handbook](index.html).** Open it locally with this folder intact. It includes logo specimens, color pairings, typography, both mood boards, a glyph catalog and campaign previews. The kit is dated November 12, 2026 and is ready for owner review.

| Guide | What it covers |
| --- | --- |
| [Positioning and SWOT](strategy.md) | Audience priorities, message hierarchy, evidence for the product promise, six competing or adjacent alternatives, and ranked strengths, weaknesses, opportunities, and threats |
| [Verbal identity and editorial style](editorial.md) | Naming, tone by surface, word choice, historical evidence and uncertainty, captions, interface copy, and correction practice |
| [Glyph and chapter mark guide](glyphs.md) | 18 interface and evidence glyphs, seven chapter marks, intended labels, sizes, contrast, semantics, individual SVGs, and a combined sprite |
| [Marketing playbook](marketing.md) | Channel sequence, campaign copy, search and share metadata, potential local partners, launch handoff, and measurement using direct feedback |
| [Press and partner kit](press-kit.md) | Boilerplate, announcement and outreach drafts, listing copy, editorial angles, image credits, and FAQs |
| [Artwork register](assets/ARTWORK.md) | Illustration captions, alt text, generation prompts, font notices, and asset provenance |

## Files for production

- **Identity.** Eight outlined lockups covering two arrangements and four colorways, four standalone mark variants, a 512 px social avatar, and a record-rule ornament. Use the version for the surface shown in the handbook. Use [the palette and web font tokens](tokens.css) as a reference for later design work.
- **Art direction.** [The City After Dusk](assets/moodboards/city-after-dusk.jpg) and [The Open Record](assets/moodboards/open-record.jpg) show the narrative and evidence treatments. The two new illustrations are available as separate JPEGs and carry the credit “AI-generated illustration.”
- **Campaign.** Seven editable SVG masters. Five digital layouts have ready-sized JPEG exports. The poster and partner card have trim-size PDF review proofs. Use the SVGs for edits and export at the intended size. The font folder contains the desktop and web formats with their licenses. The outlined logos are portable as delivered.
- **Project application.** The tour uses the arched mark, shared palette, self-hosted type, and interface glyph sprite. The handbook and campaign files stay in this local kit. The runtime palette is in [tokens.css](../src/styles/tokens.css) and the SVG sprite is rendered by [GlyphSprite.astro](../src/components/GlyphSprite.astro).

## Owner decisions before public use

1. Confirm the public name. A 2025 Saint Paul photography exhibition used the same title. The proposed lockups and listings pair **Saint Paul After Dark** with **A digital history tour of Saint Paul’s underworld, 1900–1938** to distinguish the formats. [Positioning and name overlap](strategy.md#where-it-fits)
2. Confirm the accepted edition, destination, media permissions, and release copy. Fill the print masters’ **[TOUR URL]** and the press draft’s contact and date fields after those details are chosen. Re-export print PDFs and proof their destination at actual size. The included print files are RGB with a white margin for proofing.
3. Record the human editorial, rights, listening, provenance and geography decisions in the project’s review process. The package reflects the current working preview. [Edition record](../src/data/edition.json)
