# Partner Hub MVP - Project Handoff

## Project Overview

**Partner Hub** is an internal marketplace web application that allows 77Rentals to digitize the overflow guest booking workflow. Instead of manually coordinating with DelVentto property owners via WhatsApp, admins can post guest requirements and owners can browse/respond with available properties.

**Current Status:** MVP Phase - Core features implemented with localStorage persistence (ready for Supabase backend integration in Phase 2)

**Live Route:** `/partner-hub`

---

## Tech Stack

- **Frontend Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (custom component library)
- **Form Management:** react-hook-form + Zod validation
- **Routing:** React Router v6
- **State Management:** React Context API (LanguageContext, PartnerAuthContext) + localStorage
- **Icons:** lucide-react
- **Internationalization:** Custom i18n system with Spanish/English support
- **Data Persistence:** localStorage (MVP) - to be replaced with Supabase in Phase 2

**No new npm packages added** - uses existing project dependencies only.

---

## File Structure

### New Files Created

#### Authentication & Context
- `src/contexts/PartnerAuthContext.tsx` - Auth state management (email-based login, admin/owner roles)

#### Pages
- `src/pages/PartnerHub.tsx` - Entry point with role-based routing

#### Components (PartnerHub folder)
- `src/components/PartnerHub/Layout.tsx` - Sidebar navigation wrapper
- `src/components/PartnerHub/Login.tsx` - Email verification form
- `src/components/PartnerHub/AdminDashboard.tsx` - Admin main dashboard with stats
- `src/components/PartnerHub/AdminRequirementForm.tsx` - Post new requirement modal
- `src/components/PartnerHub/AdminRequirementsList.tsx` - View requirements + responses table
- `src/components/PartnerHub/OwnerDashboard.tsx` - Owner main dashboard with tabs
- `src/components/PartnerHub/OwnerRequirementBrowser.tsx` - Searchable requirement listing
- `src/components/PartnerHub/OwnerResponseForm.tsx` - Submit property offer modal
- `src/components/PartnerHub/OwnerProfile.tsx` - Profile form (Task 9 - NEW)
- `src/components/PartnerHub/OwnerPropertyManager.tsx` - Property CRUD interface
- `src/components/PartnerHub/AdminOfferDetailModal.tsx` - Admin view full offer details (partial - Task 11)
- `src/components/PartnerHub/NDASigningSection.tsx` - NDA signing UI (Task 12 - partial)

#### Hooks
- `src/hooks/usePartnerHub.ts` - localStorage API wrapper for requirements & responses
- `src/hooks/useOwnerProfile.ts` - localStorage API for owner profiles (Task 9)
- `src/hooks/useOwnerProperties.ts` - localStorage API for owner properties

#### Data & Types
- `src/data/partnerHub.ts` - TypeScript interfaces for all Partner Hub data structures
  - GuestRequirement, PartnershipResponse, OwnerProfile, OwnerProperty, PartnerAuth, NDASignature

#### Utilities
- `src/lib/commissionCalculator.ts` - 10% commission vs custom markup calculations
- `src/lib/dateFormatter.ts` - Date range formatting (e.g., "April 21 – April 24") and COP currency formatting
- `src/lib/ndaGenerator.ts` - NDA template generation (Task 12)
- `src/lib/whatsappHelper.ts` - WhatsApp link generation with pre-filled messages (Task 12)

### Modified Files

- `src/App.tsx` - Added wildcard route `/partner-hub/*` for nested routing
- `src/lib/translations.ts` - Added 30+ translation keys for Partner Hub UI (Spanish/English)

---

## Features Implemented (MVP Phase)

### Admin Features
- ✅ Email-based login (hardcoded: `founder@77rentals.com`)
- ✅ Post guest requirements (dates, guests, budget, apartment types, notes)
- ✅ Dashboard with statistics (open requirements, total responses, accepted deals)
- ✅ View all posted requirements
- ✅ View all owner responses with status (pending/accepted/rejected)
- ✅ Accept/reject owner offers
- ✅ Commission type selection (fixed 10% or custom markup)

### Owner Features
- ✅ Email-based login (any valid email)
- ✅ Browse open guest requirements with filtering
- ✅ Submit property offers with pricing & commission calculations
- ✅ View submitted responses and their status
- ✅ **Profile Management** (Task 9 - NEW):
  - Save contact info (name, phone, email, DelVentto ID)
  - Auto-fill contact info on new offers
  - Profile persists in localStorage
- ✅ **Property Management** (Partial):
  - Create DelVentto properties with photos link
  - Property selector in offer form
  - Auto-fill apartment info when property selected

### Shared Features
- ✅ Bilingual UI (Spanish/English with language toggle)
- ✅ Responsive design for mobile/tablet/desktop
- ✅ Form validation with error messages
- ✅ Toast notifications (success/error)
- ✅ localStorage persistence for MVP
- ✅ Commission calculation (10% deduction or markup)
- ✅ Pricing breakdown with cleaning fee handling

---

## Critical Bug Fixes (Session 2)

All identified bugs from user testing have been fixed:

1. ✅ **Admin sidebar 404 errors** - Fixed React Router v6 nested routing with wildcard `/partner-hub/*` route
2. ✅ **Property auto-fill** - Added useEffect hook to setValue() apartment info when property selected
3. ✅ **Cleaning fee validation** - Removed optional modifier, made field required
4. ✅ **Total amount calculation overflow** - Fixed type coercion with Number() wrapper on price fields
5. ✅ **Spanish translation missing** - Added 30+ translation keys, replaced all hardcoded English strings with t() function
6. ✅ **Modal close buttons not working** - Added type="button" to prevent form submission on click

---

## Data Flow & Architecture

### Authentication Flow
1. User navigates to `/partner-hub`
2. If not logged in, shows Login component
3. User selects role (admin/owner) and enters email
4. PartnerAuthContext stores auth state in localStorage
5. Routes conditionally render admin or owner dashboard based on role

### Requirement Posting Flow (Admin)
1. Admin clicks "Post New Requirement"
2. AdminRequirementForm modal opens
3. Admin fills: guests, dates, budget, apartment types, notes, commission type
4. On submit: Requirement saved to localStorage via usePartnerHub hook
5. AdminDashboard stats update automatically

### Offer Submission Flow (Owner)
1. Owner browsing requirements clicks "Offer Property"
2. OwnerResponseForm modal opens with requirement details pre-filled
3. Owner selects property from dropdown
4. Property info auto-fills (apartment type, Google Drive link)
5. Owner contact info auto-fills from saved profile (Task 9)
6. Owner sets nightly price, cleaning fee
7. Commission calculated in real-time
8. On submit: Response saved to localStorage
9. Admin sees new response in AdminRequirementsList

### Profile Management (Task 9)
1. Owner navigates to "My Profile" tab
2. Form loads existing profile from localStorage if available
3. Owner updates info and saves
4. Next time owner submits an offer, contact info auto-fills

---

## Testing Credentials (MVP)

### Admin
- **Email:** `founder@77rentals.com`
- **Password:** None (email verification only)

### Owner
- **Email:** Any valid email (e.g., `owner@delventto.com`)
- **Password:** None (email verification only)

---

## Next Steps - PRIORITY ORDER

🚨 **CRITICAL - FIX LOCAL DEV SERVER FIRST**
> The localhost preview is currently not working. **The absolute first priority in the new session must be fixing the local dev server** so we can test the app live and verify all features are working. Without a working preview, we cannot validate functionality or catch new bugs. Check:
> - Dev server process (is `npm run dev` running?)
> - Port 5174 accessibility (try `http://localhost:5174/partner-hub`)
> - Build errors in console
> - Module resolution issues
> - If the server won't start, check for syntax errors or missing imports in recently modified files

After dev server is fixed and working:

### Task 10: Owner Property Management (Full Implementation)
**Status:** Partial - files created, needs completion
**Priority:** High - Required for owner offer submission flow

**Description:**
Complete the OwnerPropertyManager component to provide full CRUD for owner properties:
- List view with table showing property names, types, and actions
- "Add Property" button opens modal with form (propertyName, apartmentType, googleDriveLink, iCalLink)
- Edit/Delete buttons with confirmations
- Validation (required fields, valid Google Drive URLs)
- Toast notifications on success/error
- Integration: Already in OwnerDashboard "My Properties" tab
- Integration: Already used in OwnerResponseForm for property selection

**Files to Complete:**
- `src/components/PartnerHub/OwnerPropertyManager.tsx` (create full implementation)

**Requirements from Plan:**
- [ ] Create/Read/Update/Delete properties
- [ ] Property fields: id, ownerId, propertyName, apartmentType, googleDriveLink, iCalLink (optional)
- [ ] Validation with Zod schema
- [ ] Modal for add/edit with form
- [ ] Delete with confirmation dialog
- [ ] Success/error toasts
- [ ] Bilingual support (Spanish/English)
- [ ] localStorage persistence with custom hook

---

### Task 11: Admin View Offer Details (Full Implementation)
**Status:** Not started
**Priority:** High - Required for admin deal management

**Description:**
Enhance admin dashboard to show detailed offer information in expandable modal:
- Create AdminOfferDetailModal component
- Display when admin clicks on a response in AdminRequirementsList
- Show full requirement info (dates formatted, guests, budget, apartment types allowed)
- Show property info (name, type, photos link, description)
- Show pricing breakdown (nightly rate, commission, cleaning fee, total)
- Show owner contact (name, phone, email)
- Accept/Reject buttons in modal
- Status badge (Pending/Accepted/Rejected)

**Files to Create/Modify:**
- Create: `src/components/PartnerHub/AdminOfferDetailModal.tsx`
- Modify: `src/components/PartnerHub/AdminRequirementsList.tsx` (add click handler to open modal)

**Requirements from Plan:**
- [ ] Modal displays all requirement + property + pricing details
- [ ] Pre-filled contact info shown clearly
- [ ] Accept/Reject buttons update response status in localStorage
- [ ] Modal closes after action with toast notification
- [ ] Bilingual support

---

### Task 12: NDA Signing Workflow (Full Implementation)
**Status:** Utilities created (ndaGenerator.ts, whatsappHelper.ts), component created but not integrated
**Priority:** Medium - Required after offer acceptance

**Description:**
Implement digital NDA signing workflow post-acceptance:
- After admin accepts an offer, NDA section appears below offer details
- Admin signs first with name + agreement checkbox
- System shows "Pending owner signature"
- Owner receives link/notification to sign
- Owner signs with name + agreement checkbox
- When both signed:
  - Owner contact info unlocks/becomes visible
  - WhatsApp link generated to send to owner
  - NDA PDF downloadable
- Signatures persist in localStorage

**Files to Complete/Integrate:**
- Complete: `src/components/PartnerHub/NDASigningSection.tsx` (already created)
- Modify: `src/components/PartnerHub/AdminOfferDetailModal.tsx` (integrate NDA section)
- Use: `src/lib/ndaGenerator.ts` (template generation - already created)
- Use: `src/lib/whatsappHelper.ts` (WhatsApp link - already created)

**Requirements from Plan:**
- [ ] Extend PartnershipResponse with ndaStatus, adminSignature, ownerSignature fields
- [ ] NDA section shows in AdminOfferDetailModal after acceptance
- [ ] Admin signature form (name + agreement checkbox)
- [ ] Owner signature form (name + agreement checkbox)
- [ ] Signature status display with checkmarks
- [ ] Contact info hidden until both sign
- [ ] Contact info visible + unlocked after both sign
- [ ] WhatsApp link generation with pre-filled message
- [ ] NDA PDF download
- [ ] Bilingual support
- [ ] Update usePartnerHub hook to support NDA status updates

---

## Known Limitations (MVP)

- Email verification is simple (no actual verification email sent)
- No real user authentication (localStorage-based only)
- No email notifications to owners
- No file uploads (uses external Google Drive links)
- No real payment/commission tracking
- No backend persistence (localStorage cleared on browser clear)
- Admin contact hardcoded as "Claudia Moreno" + specific phone/email

---

## Phase 2: Backend Integration (Future)

When ready to move beyond MVP:
- Replace localStorage with Supabase (PostgreSQL database)
- Implement real email verification and notifications
- Add admin authentication with proper access control
- Payment processing for commission collection
- Real-time updates using Supabase realtime subscriptions
- File upload handling for property photos
- Analytics dashboard for deal tracking

---

## Quick Commands

```bash
# Start dev server
npm run dev

# Build for production
npm build

# Preview build locally
npm preview

# In worktree directory
cd .worktrees/partner-hub-feature

# View git status
git status

# View recent commits
git log --oneline -10

# Commit changes
git add -A
git commit -m "feat: description"
```

---

## Key Architecture Decisions

1. **localStorage for MVP** - Fast iteration without backend setup, easy to replace with Supabase
2. **React Context for auth** - Simple, no extra dependencies, sufficient for MVP
3. **Zod validation** - Type-safe form validation, prevents bad data
4. **Custom i18n** - Simple translation system, no i18n library bloat
5. **Component co-location** - All Partner Hub components in `/components/PartnerHub/` folder for clarity
6. **Utility-first CSS** - Tailwind classes, consistent with existing codebase
7. **UUID for IDs** - generateUUID helper for consistent ID generation

---

## Session History

**Session 1:** Initial implementation of Partner Hub MVP including admin dashboard, owner dashboard, forms, routing, and auth system

**Session 2:** Bug fixes and feature completions:
- Fixed admin sidebar 404 routing errors
- Fixed property auto-fill functionality
- Made cleaning fee required
- Fixed total amount calculation overflow
- Added Spanish translation throughout
- Fixed modal close buttons
- Implemented Task 9 (Owner Profile Management)

**Session 3 (Next):** Fix dev server, then implement Tasks 10, 11, 12

---

## Contact & Questions

All work tracked in git commits with descriptive messages. Check git log for implementation details.
