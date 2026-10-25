## Content and Audience

Both of them understood that the site is for people who want to make MTG proxy decks. They understood that the point is to make a whole deck at once. Benjii described the process of sending the cards to a printer and paying for them. That part is still planned, so I made sure the text on the site makes that clear.

They didn't suggest much that needed to change about the content itself. Brady did point out that the pages were missing meta descriptions. I added a description for each page and used the keywords from my research in the titles, headings, and page text.

## Design and User Experience

They liked the dark background, orange text, and logo. The design seemed to get the idea across, and they didn't report any problems finding their way around the site.

Benjii suggested changing the video size for different screen sizes and zoom levels. I checked it across all the desktop viewport sizes available to me and didn't see a sizing problem, so I kept the size as it was. The old video was one I made for another project, so I replaced it with a CardConjurer tutorial that fits this site better.

## Functionality and Performance

Brady's Lighthouse results suggested improving image loading and cache lifetimes. The image files were much larger than they needed to be for how they were being displayed. I resized and compressed the five large images, switched four of them to WebP, and made the tab icon much smaller. Those files are now about 98% smaller in total. I also added lazy loading to the two card examples so the browser can wait until the user gets close to them before loading them. I haven't changed the server's cache settings yet.

Benjii said the site worked well on mobile and desktop and looked the same in Chrome and Safari. He also said he didn't find any dead links.

## Accessibility and Usability

Both reviews pointed out that the pages were missing a main landmark or page regions. I changed the main content container from a `<div>` to a `<main>` on all three pages. This gives screen readers a way to identify the main content. Benjii also said keyboard navigation worked well.

Benjii suggested making sure the video has captions. I set the new video to show English captions by default when they're available.

## Action Plan

They seemed to like the colors, logo, and overall idea of the site the most. The two main improvements I chose based on their feedback were:

1. **Add a main landmark to each page.** I replaced the main content container with a `<main>` element on all three pages so screen readers can identify that part of the page.
2. **Improve image loading.** I resized and compressed the large images based on their size on the desktop pages. I also added lazy loading to the two card examples farther down the Help page.

After uploading the changes, I'll check the live pages.