Use the uploaded reference image as the primary visual and structural reference.

Recreate the sidebar layout, proportions, spacing, typography hierarchy, icon positioning, active states, collapsed state, profile section, and profile dropdown shown in the reference.

Do not simply copy the image as a flat screenshot. Recreate it as a functional, responsive UI component.

Build a modern, minimalist, production-ready SaaS dashboard sidebar based closely on the uploaded reference image.

Use the reference image as the primary visual and structural reference. Recreate the proportions, spacing, typography hierarchy, icon positioning, active states, collapsed state, profile section, and profile dropdown as closely as possible.

Do not simply recreate the image as a static screenshot. Build it as a functional, reusable and responsive UI component.

TECH STACK:
- React
- TypeScript
- Tailwind CSS
- Lucide React icons
- Component-based architecture
- Fully responsive
- Use Flexbox for layout
- Avoid unnecessary absolute positioning
- Use CSS variables/design tokens for dimensions, colors, spacing and radius

SIDEBAR STATES:

1. EXPANDED SIDEBAR
- Width: 260px
- Height: 100vh
- White / very light gray background
- Rounded corners approximately 12px
- Subtle border
- Very subtle shadow
- 16px horizontal padding
- Clean, spacious minimalist appearance
- Use a modern sans-serif font such as Inter

At the top:
- Purple square application logo
- Logo contains a simple white abstract star/spark icon
- App name: "Sonicline"
- Logo and app name aligned horizontally

Below the logo:
- Search bar
- Height: approximately 40px
- Search icon on the left
- Placeholder: "Search"
- Keyboard shortcut indicator "⌘ K" on the right
- Rounded corners approximately 6–8px

NAVIGATION:

Create the following navigation structure:

MENU
- Dashboard
- Products
- Schedule
- My Task
- Reporting

ACCOUNT
- User
- Messages
- Document
- Notification
- Live chat
- Help

Use Lucide React icons or equivalent simple thin-line monochrome icons.

Navigation requirements:
- Each item should have consistent height and spacing
- Icon width should be consistent
- Text aligned consistently
- Use approximately 36px item height
- Use approximately 6px border radius
- Use approximately 12px horizontal padding
- Maintain consistent vertical spacing

ACTIVE STATE:
Dashboard should be active by default.

Active item:
- Light gray background
- Darker text and icon
- Rounded corners
- No strong shadow
- Should look subtle and clean

BADGES:
- My Task has a small notification badge containing "4"
- Messages has a small notification badge containing "8"
- Badges should be positioned on the right side
- Purple / light purple accent
- Small rounded pill/circle appearance

BOTTOM USER PROFILE:
The user profile section must remain pinned to the bottom of the sidebar.

Display:
- Circular profile image
- Name: "Dianne Russell"
- Email: "dianne.russell@gmail.com"
- Small downward chevron on the right

The profile section should be visually separated from the navigation area with appropriate spacing or a subtle divider.

2. COLLAPSED SIDEBAR

When collapsed:
- Width: 76px
- Same height and visual style as expanded sidebar
- Hide all text labels
- Keep only icons
- Logo remains at the top
- Search becomes only the search icon
- Navigation icons centered horizontally
- Keep navigation order exactly the same
- Preserve active state
- Preserve notification badges
- Bottom profile becomes only the circular profile image

The collapsed sidebar should maintain balanced spacing and should not feel cramped.

INTERACTION:

Implement an expand/collapse sidebar state.

Dimensions:
- Expanded: 260px
- Collapsed: 76px

Animation:
- Smooth 200–300ms ease-in-out transition
- Icons should remain visually aligned during transition
- Avoid layout jumping
- Text should smoothly disappear/appear
- Sidebar content should remain vertically stable

When collapsed:
- Hovering over an icon should display a small dark tooltip
- Example: hovering the calendar icon displays "Schedule"
- Tooltip should appear beside the sidebar
- Tooltip should have a dark background, white text and small rounded corners

The active navigation item must remain clearly visible in collapsed mode.

PROFILE DROPDOWN:

Clicking the user profile should open a floating profile dropdown.

Dropdown items:
- Profile
- Upgrade to pro
- Settings
- Add account
- Log out

Dropdown design:
- White background
- Width approximately 230–260px
- Rounded corners: 10–12px
- Subtle shadow
- 16px horizontal padding
- Simple monochrome Lucide icons
- Consistent item height and spacing
- Thin divider where appropriate
- Positioned close to the bottom profile section

Hover states:
- Each item should have a subtle light-gray background
- "Log out" should also have a subtle light-gray hover background
- Avoid bright red unless necessary

DESIGN TOKENS:

Use these values as the default design system:

--sidebar-expanded: 260px;
--sidebar-collapsed: 76px;
--sidebar-radius: 12px;
--sidebar-padding: 16px;
--item-height: 36px;
--item-radius: 6px;
--transition: 250ms ease-in-out;

Colors:
- Sidebar background: white
- Main active background: #F3F3F5
- Border: #E5E5E5
- Primary text: dark charcoal
- Secondary text: muted gray
- Accent: purple
- Badge background: light purple
- Badge text: purple
- Tooltip: dark charcoal
- Tooltip text: white

VISUAL STYLE:

Follow the reference image closely.

The overall visual language should be:
- Modern SaaS dashboard
- Minimalist
- Clean
- Professional
- Enterprise-ready
- Spacious
- Soft rounded corners
- Subtle borders
- Very subtle shadows
- Purple branding accent
- Thin monochrome icons
- No gradients
- No excessive decoration
- No unnecessary UI elements
- No oversized typography

IMPORTANT:
- Match the reference proportions and spacing as closely as possible.
- Maintain visual consistency between expanded and collapsed states.
- Do not redesign the navigation structure.
- Do not add additional menu items.
- Do not use excessive animations.
- Do not use large shadows.
- Do not make the sidebar visually heavy.
- Make the result look like a polished production SaaS application rather than a concept mockup.

The final result should feel extremely close to the uploaded reference while being implemented as a clean, reusable, responsive React component.