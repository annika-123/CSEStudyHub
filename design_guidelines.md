# Engineering Study Platform - Design Guidelines

## Design Approach
**Reference-Based + Custom Theme**: Drawing inspiration from modern educational platforms like Notion, Khan Academy, and Linear's dark mode, while strictly adhering to the provided dark theme with cyan/turquoise accent system. This is a **utility-focused application** where clarity, readability, and efficient navigation are paramount for students accessing study materials.

## Core Visual Theme (User-Specified)
- **Primary Color**: Cyan/Turquoise (#00CED1) for accents, CTAs, active states, and highlights
- **Background**: Dark Navy (#0A1628) as the primary background
- **Surface Colors**: Slightly lighter navy (#0F1F3A, #152238) for cards and elevated surfaces
- **Text**: White (#FFFFFF) for primary text, gray-400 (#9CA3AF) for secondary text
- **Gradients**: Subtle cyan-to-blue gradients for visual interest on key elements

## Typography System
- **Font Family**: Inter or Poppins via Google Fonts for modern, clean readability
- **Hierarchy**:
  - H1 (Page Titles): 3xl-4xl, font-bold, white
  - H2 (Section Headers): 2xl-3xl, font-semibold, white
  - H3 (Card Titles): xl-2xl, font-semibold, white
  - Body Text: base-lg, font-normal, white/gray-300
  - Labels/Metadata: sm-base, font-medium, gray-400
  - Button Text: base, font-semibold, white

## Layout System
**Spacing Units**: Use Tailwind spacing of 4, 6, 8, 12, 16, 20 for consistency
- **Container**: max-w-7xl mx-auto px-6 for all content areas
- **Cards**: Rounded corners (rounded-xl), subtle shadow, padding p-6 to p-8
- **Grid Layouts**: 2-3 column grids on desktop, single column on mobile

## Screen-Specific Layouts

### 1. UID Entry Screen
- Centered vertical layout (min-h-screen flex items-center justify-center)
- Logo/platform name at top with cyan gradient text effect
- Large input field with cyan border focus state
- Prominent "Continue" button with cyan background
- Subtle background pattern or gradient overlay
- Welcome message with small text below input

### 2. Branch Selection Screen
- Header with back button and progress indicator
- Page title: "Select Your Engineering Branch"
- Grid of branch cards (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Each card: Icon, branch name, brief description, hover state with cyan glow
- Cards have dark surface background (#0F1F3A) with border

### 3. Year Selection Screen
- Similar header structure with back navigation
- Page title: "Select Your Academic Year"
- 4 large year cards in grid (1st, 2nd, 3rd, 4th year)
- Cards show year number prominently with semester information
- Selected state: cyan border + cyan background tint

### 4. Subject Selection Screen
- Header shows selected branch and year
- Grid of subject cards with consistent styling
- Each card: Subject code, full name, credit hours
- Checkbox or radio selection pattern with cyan accent

### 5. Study Notes View
- Sidebar navigation (left, 240px width) with subject outline/topics
- Main content area with generated notes
- Sticky header with subject name and action buttons
- Action buttons: "Take Quiz", "View FAQs" with cyan accent
- Notes rendered in readable typography with proper heading hierarchy
- Code blocks (if applicable) with syntax highlighting

### 6. Quiz Interface
- Question counter and progress bar (cyan fill)
- Large question card with multiple-choice options
- Radio buttons with cyan selected state
- "Submit" and "Next" buttons
- Score display card at end with celebration element

### 7. FAQ Section
- Accordion-style expandable questions
- Search bar at top with cyan focus state
- Question items with cyan indicator on hover
- Expanded answer with proper typography spacing

## Component Library

### Navigation
- Back button: Arrow icon + "Back" text, gray-400, hover cyan
- Progress indicator: Stepped progression with cyan active steps
- Breadcrumbs where applicable

### Buttons
- Primary: Cyan background, white text, rounded-lg, px-6 py-3
- Secondary: Transparent with cyan border, cyan text
- Hover states: Slight brightness increase, no blur needed unless on images

### Cards
- Background: #0F1F3A with subtle border (#1F2937)
- Hover: Border changes to cyan, subtle glow effect
- Active/Selected: Cyan border with cyan/10 background tint
- Padding: p-6 standard, p-8 for larger cards

### Form Inputs
- Dark background with lighter border
- Cyan border on focus
- White text, gray-400 placeholder
- Rounded corners (rounded-lg)

### Icons
- Use Heroicons via CDN
- Size: 5-6 for standard UI, 8-10 for feature icons, 12-16 for decorative
- Color: gray-400 default, cyan for active states

## Animations
**Minimal approach** - use sparingly:
- Fade-in on page transitions (duration-300)
- Scale hover effect on cards (scale-105)
- Smooth color transitions on interactive elements (transition-colors)
- Progress bar fill animation for quiz

## Data Visualization (Quiz Results)
- Circular progress indicators with cyan stroke
- Simple bar charts for performance metrics
- Score cards with gradient backgrounds

## Accessibility
- Maintain WCAG AA contrast ratios (white text on dark backgrounds)
- Focus visible states with cyan outline
- Proper heading hierarchy throughout
- Keyboard navigation support for all interactive elements

## Images
**No hero images required** - This is a utility-focused application. Use:
- Small icons/illustrations for branch selection cards
- Decorative elements in empty states
- Success illustrations for quiz completion
- Background patterns (subtle, low opacity) for visual interest