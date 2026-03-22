# ResumeIQ Design System

## 1. Typography

The typography system balances the editorial weight of **Manrope** with the functional precision of **Inter** and **JetBrains Mono**.

- **Display & Headlines (Manrope):** Used for candidate names and high-level stats. The wide tracking and bold weights convey a premium, modern-enterprise feel.
- **Body & Titles (Inter):** The workhorse font. Use `title-md` for section headers to maintain a clean, readable flow.
- **The Scoreboard (JetBrains Mono):** All AI scores and technical skill matches must use `JetBrains Mono`. This monospace choice signals "data integrity" and technical precision, distinguishing raw data from editorial content.

**Fonts defined in theme:**
- Headline Font: **MANROPE**
- Body Font: **INTER**
- Label Font: **INTER**

---

## 2. Color Palette

The palette is anchored in deep, authoritative navies (`#00285f`) and intelligent electric blues (`#3d5d9a`).

### Core Brand Colors
| Role | Hex Code |
| :--- | :--- |
| **Primary** | `#00285f` |
| **On Primary** | `#ffffff` |
| **Primary Container** | `#003d8a` |
| **On Primary Container** | `#84acff` |
| **Secondary** | `#3d5d9a` |
| **On Secondary** | `#ffffff` |
| **Secondary Container** | `#9cbbfe` |
| **Tertiary** | `#003120` |
| **On Tertiary** | `#ffffff` |

### Backgrounds & Surfaces
| Role | Hex Code |
| :--- | :--- |
| **Background** | `#fcf8ff` |
| **On Background** | `#1a1a2e` |
| **Surface** | `#fcf8ff` |
| **On Surface** | `#1a1a2e` |
| **Surface Variant** | `#e2e0fc` |
| **On Surface Variant** | `#434750` |
| **Surface Container** | `#efecff` |
| **Surface Container Highest** | `#e2e0fc` |
| **Outline** | `#747781` |
| **Outline Variant** | `#c4c6d1` |

### Status & Feedback
| Role | Hex Code |
| :--- | :--- |
| **Error** | `#ba1a1a` |
| **On Error** | `#ffffff` |
| **Error Container** | `#ffdad6` |
| **On Error Container** | `#93000a` |

---

## 3. Design Philosophy & Elevation
**Creative North Star: "The Intelligent Layer"**
This design system moves beyond the traditional "grid of boxes" typical of Enterprise SaaS. Instead, it treats the interface as an editorial platform where AI-driven insights are surfaced through a sophisticated hierarchy of light and depth.

### The "No-Line" Rule
Traditional 1px borders are strictly prohibited for sectioning. They create visual noise and "grid-lock." Instead, boundaries must be defined through Background Tonal Shifts.
- To separate a sidebar from the main content, use `surface-container-low` against a `surface` background.
- For nested sections within a profile, use `surface-container-high` to create a natural, soft-edge distinction.

### Glass & Gradient Signature
To signify AI-powered "intelligence," floating insights or tooltips should utilize **Glassmorphism**. Use semi-transparent `surface-variant` colors with a `backdrop-blur` of 12px. For primary CTAs and high-level analytical headers, apply a subtle linear gradient from `primary` (#00285f) to `primary_container` (#003d8a) at a 135-degree angle to provide a "jewel-toned" depth that feels custom-engineered.
