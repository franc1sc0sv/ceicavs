# Section Implementation Prompt

Copy and paste this prompt into your coding agent to implement a single section. Replace the placeholder variables before using.

**Variables to replace:**
- `SECTION_NAME` -- Display name of the section (e.g., "Attendance")
- `SECTION_ID` -- Kebab-case identifier (e.g., "attendance")
- `NN` -- Two-digit milestone number (e.g., "03")

---

I need you to implement the **SECTION_NAME** section for the CEICAVS school management platform.

## Step 1: Read the product context

Read these files to understand the product and this section's requirements:

1. `product-plan/product-overview.md` -- Product description, roles, entities, and design system.
2. `product-plan/instructions/incremental/NN-SECTION_ID.md` -- Implementation instructions specific to this section.

## Step 2: Review section assets

Review the design and data assets for this section:

- `product-plan/data-shapes/overview.ts` -- TypeScript interfaces for the data this section's components expect. Look for the "SECTION_NAME" section header.
- `product-plan/sections/SECTION_ID/` -- Reference components, screenshots, and `tests.md` with UI behavior specs.
- `product-plan/design-system/` -- Color tokens and typography to follow.

If the shell is not yet implemented, also review:
- `product-plan/shell/` -- Shell components for layout integration.

## Step 3: Ask clarifying questions

Before writing any code, ask me about:

1. **Integration** -- How this section connects to the existing codebase (routing, state management, API layer).
2. **Product requirements** -- Any changes to the flows, role behavior, or UI described in the spec.
3. **Additional notes** -- Anything else I should know.

## Step 4: Implement

After I answer your questions, implement the SECTION_NAME section following the incremental instruction file. Ensure:

- All components accept data and callbacks via props (no direct data imports).
- Role-based behavior matches the spec (admin, teacher, student views).
- Light and dark mode are fully supported with `dark:` variants.
- Responsive layout works across mobile, tablet, and desktop.
- i18n keys are used for all user-facing strings (react-i18next).
- The section integrates cleanly into the existing shell layout.
