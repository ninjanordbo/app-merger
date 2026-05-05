# Prototype Environment - Quick Start Guide

Welcome to the Nabolagshelse Prototype Environment! This is a safe, isolated space where you can experiment with UI components and features without affecting the main application.

## What is this?

The prototype environment is a separate area of the application (accessible at `/prototype`) where team members can:
- Mock up new UI features
- Experiment with components
- Test new design ideas
- Create interactive prototypes

**Important**: Changes here do NOT affect the main application!

---

## Getting Started from Scratch

### Prerequisites

Before you begin, make sure you have installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- A code editor like **VS Code** - [Download here](https://code.visualstudio.com/)

### Step 1: Clone the Repository

Open your terminal (Command Prompt on Windows, Terminal on Mac/Linux) and run:

```bash
# Clone the repository
git clone https://github.com/Nabolagshelse/nabolagshelse-app.git

# Navigate into the project folder
cd nabolagshelse-app

# Select templates branch
git checkout templates
```

### Step 2: Install Dependencies

Install all required packages (this will take a few minutes):

```bash
npm install
```

Wait for the installation to complete. You'll see a lot of text scrolling by - this is normal!

### Step 3: Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
# Copy the example environment file
cp .env.example .env
```

**Windows users**: If the above doesn't work, manually copy `.env.example` and rename it to `.env`

The `.env` file contains configuration for the app. For the prototype environment, the default values work fine - you can leave them as is.

### Step 4: Start the Development Server

Start the development server:

```bash
npm run dev
```

You should see output like:
```
Nuxt 3.20.2
➜ Local:    http://localhost:3000/
```

**Keep this terminal window open!** The development server needs to keep running.

### Step 5: Access the Prototype Environment

Open your web browser and visit:

```
http://localhost:3000/prototype
```

🎉 **You're ready to start prototyping!**

---

## Quick Reference

### Starting the Server (Next Time)

When you come back to work on prototypes:

```bash
# Navigate to the project folder
cd nabolagshelse-app

# Start the development server
npm run dev

# Open http://localhost:3000/prototype in your browser
```

### Stopping the Server

Press `Ctrl + C` in the terminal where the server is running.

---

## Understanding the Structure

The prototype environment has its own isolated structure:

```
nabolagshelse-app/
├── pages/prototype/          # Your prototype pages go here
│   ├── index.vue            # Home page (/prototype)
│   ├── dashboard.vue        # Dashboard page (/prototype/dashboard)
│   └── settings.vue         # Settings page (/prototype/settings)
│
├── components/prototype/     # Reusable components
│   ├── Header.vue           # Top header
│   ├── Sidebar.vue          # Side navigation
│   └── NavLink.vue          # Navigation links
│
├── store/prototype/         # State management
│   └── app.ts              # Prototype store
│
├── layouts/
│   └── prototype.vue        # Layout wrapper (sidebar + header)
│
└── starter-template/        # Documentation & templates
    ├── README.md           # This file
    ├── QUICK_REFERENCE.md  # Quick lookup guide
    └── TEMPLATE.vue        # Page template to copy
```

---

## Creating Your First Prototype Page

### Option 1: Use the Template (Easiest)

1. **Copy the template file**:
   ```bash
   cp starter-template/TEMPLATE.vue pages/prototype/my-page.vue
   ```

2. **Open `pages/prototype/my-page.vue` in your editor**

3. **Change the title** in the `definePageMeta` section:
   ```vue
   definePageMeta({
     title: "My Page",  // Change this
     layout: "prototype",
   });
   ```

4. **Modify the content** as needed

5. **Save the file** - your browser will automatically reload!

6. **View your page** at: `http://localhost:3000/prototype/my-page`

### Option 2: Create from Scratch

Create a new file `pages/prototype/my-page.vue`:

```vue
<template>
  <div class="space-y-6">
    <div class="rounded-lg border border-neutral-200 bg-white p-6">
      <h2 class="mb-4 text-xl font-semibold text-neutral-900">
        My New Feature
      </h2>
      <p class="text-neutral-600">
        Add your content here!
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  title: "My Feature",
  layout: "prototype",
});
</script>
```

Your page is automatically available at `/prototype/my-page`

---

## Adding Navigation to Your Page

To add your new page to the sidebar menu:

1. Open `components/prototype/Sidebar.vue`

2. Find the navigation section (around line 64)

3. Add a new navigation link:

```vue
<PrototypeNavLink path="/prototype/my-page">
  <template #icon>
    <LucideRocket :size="20" />
  </template>
  <template v-if="!isCollapsed" #text>My Page</template>
</PrototypeNavLink>
```

4. Save the file - your navigation will update automatically!

---

## Creating Reusable Components

Components let you reuse the same UI element across multiple pages.

### Step 1: Create the Component

Create a file in `components/prototype/`, for example `MyCard.vue`:

```vue
<template>
  <div class="rounded-lg border border-neutral-200 bg-white p-6">
    <h3 class="mb-2 font-semibold text-neutral-900">{{ title }}</h3>
    <p class="text-sm text-neutral-600">
      <slot />
    </p>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
});
</script>
```

### Step 2: Use the Component

In any prototype page, use it like this:

```vue
<template>
  <div class="space-y-6">
    <PrototypeMyCard title="Card 1">
      This is the content of card 1
    </PrototypeMyCard>

    <PrototypeMyCard title="Card 2">
      This is the content of card 2
    </PrototypeMyCard>
  </div>
</template>
```

**Note**: Component names are auto-generated:
- File: `components/prototype/MyCard.vue`
- Use as: `<PrototypeMyCard />`

---

## Using State Management

The prototype has its own Pinia store for managing state (data that needs to be shared across pages).

### Accessing the Store

In any prototype page:

```vue
<script setup>
const store = usePrototypeAppStore();

// Read state
console.log(store.counter);  // Current counter value
console.log(store.message);  // Current message

// Read computed values
console.log(store.doubleCounter);  // Counter × 2

// Update state
store.increment();           // Add 1 to counter
store.decrement();           // Subtract 1 from counter
store.setMessage("Hello!");  // Change message
</script>
```

### Adding Your Own State

Open `store/prototype/app.ts` and add to the state:

```typescript
state: () => ({
  isLoading: false,
  message: "Welcome!",
  counter: 0,
  myCustomData: [],  // Add your own state here
}),
```

Then add actions to modify it:

```typescript
actions: {
  setMyCustomData(data) {
    this.myCustomData = data;
  },
}
```

---

## Styling with Tailwind CSS

This project uses Tailwind CSS for styling. Instead of writing custom CSS, you use pre-built classes.

### Common Patterns

#### Card Container
```vue
<div class="rounded-lg border border-neutral-200 bg-white p-6">
  <!-- content -->
</div>
```

#### Grid Layout (responsive)
```vue
<!-- 1 column on mobile, 2 on tablet, 3 on desktop -->
<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

#### Flex Layout
```vue
<div class="flex items-center gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

#### Primary Button
```vue
<button class="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-700">
  Click Me
</button>
```

#### Secondary Button
```vue
<button class="rounded-md border border-primary bg-white px-4 py-2 text-primary hover:bg-primary/5">
  Click Me
</button>
```

### Quick Styling Reference

**Colors:**
- `bg-white` - White background
- `bg-neutral-50` - Light gray background
- `bg-primary` - Primary color (blue)
- `text-neutral-900` - Dark text (for headings)
- `text-neutral-600` - Medium text (for body)
- `text-primary` - Primary color text

**Spacing:**
- `p-6` - Padding on all sides
- `px-4` - Horizontal padding (left + right)
- `py-2` - Vertical padding (top + bottom)
- `gap-4` - Space between flex/grid items
- `space-y-6` - Vertical space between children

**Sizing:**
- `w-full` - 100% width
- `h-screen` - 100% viewport height
- `size-12` - Width and height (3rem / 48px)

**Text:**
- `text-sm` - Small text (14px)
- `text-lg` - Large text (18px)
- `text-xl` - Extra large text (20px)
- `font-medium` - Medium weight
- `font-semibold` - Semibold weight
- `font-bold` - Bold weight

**Borders & Rounding:**
- `border` - Add border
- `border-neutral-200` - Light gray border
- `rounded-lg` - Large rounded corners
- `rounded-md` - Medium rounded corners
- `rounded-full` - Fully rounded (circles)

**Responsive Design:**
- `md:text-lg` - Apply only on tablet and up
- `lg:grid-cols-3` - Apply only on desktop and up

See the full [Tailwind documentation](https://tailwindcss.com/docs) for more.

---

## Using Icons

The project uses Lucide icons. Here's how to use them:

### In Your Template

```vue
<template>
  <div class="flex items-center gap-2">
    <LucideHome :size="20" />
    <span>Home</span>
  </div>
</template>
```

### Common Icons

- `<LucideHome>` - House icon
- `<LucideSettings>` - Gear icon
- `<LucideUsers>` - People icon
- `<LucideLayoutDashboard>` - Dashboard icon
- `<LucidePlus>` - Plus sign
- `<LucideCheck>` - Checkmark
- `<LucideX>` - X/close icon
- `<LucideRocket>` - Rocket icon
- `<LucideSave>` - Save icon
- `<LucideDownload>` - Download icon
- `<LucideUpload>` - Upload icon

**Browse all icons**: [lucide.dev/icons](https://lucide.dev/icons/)

**Change icon size**: Use the `:size` prop (e.g., `:size="16"`, `:size="20"`, `:size="24"`)

---

## Interactive Features

### Click Events

```vue
<template>
  <button @click="handleClick">Click Me</button>
</template>

<script setup>
const handleClick = () => {
  alert('Button clicked!');
};
</script>
```

### Input Binding

```vue
<template>
  <input v-model="name" type="text" placeholder="Enter name" />
  <p>You entered: {{ name }}</p>
</template>

<script setup>
const name = ref('');
</script>
```

### Show/Hide Content

```vue
<template>
  <button @click="isVisible = !isVisible">
    Toggle
  </button>
  <div v-if="isVisible">
    This content can be toggled
  </div>
</template>

<script setup>
const isVisible = ref(true);
</script>
```

### Lists

```vue
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      {{ item.name }}
    </li>
  </ul>
</template>

<script setup>
const items = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
];
</script>
```

---

## Examples

### Example 1: Simple Card Grid

```vue
<template>
  <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    <div class="rounded-lg border border-neutral-200 bg-white p-6">
      <h3 class="font-semibold text-neutral-900">Card 1</h3>
      <p class="text-sm text-neutral-600">Description of card 1</p>
    </div>

    <div class="rounded-lg border border-neutral-200 bg-white p-6">
      <h3 class="font-semibold text-neutral-900">Card 2</h3>
      <p class="text-sm text-neutral-600">Description of card 2</p>
    </div>

    <div class="rounded-lg border border-neutral-200 bg-white p-6">
      <h3 class="font-semibold text-neutral-900">Card 3</h3>
      <p class="text-sm text-neutral-600">Description of card 3</p>
    </div>
  </div>
</template>
```

### Example 2: Interactive Counter

```vue
<template>
  <div class="rounded-lg border border-neutral-200 bg-white p-6">
    <h3 class="mb-4 text-lg font-semibold">Counter: {{ count }}</h3>

    <div class="flex gap-2">
      <button
        @click="count++"
        class="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-700"
      >
        Increment
      </button>

      <button
        @click="count--"
        class="rounded-md bg-neutral-200 px-4 py-2 hover:bg-neutral-300"
      >
        Decrement
      </button>

      <button
        @click="count = 0"
        class="rounded-md border border-neutral-300 px-4 py-2 hover:bg-neutral-50"
      >
        Reset
      </button>
    </div>
  </div>
</template>

<script setup>
const count = ref(0);
</script>
```

### Example 3: Form with Input

```vue
<template>
  <div class="rounded-lg border border-neutral-200 bg-white p-6">
    <h3 class="mb-4 text-lg font-semibold">Contact Form</h3>

    <div class="space-y-4">
      <div>
        <label class="mb-2 block text-sm font-medium">Name</label>
        <input
          v-model="form.name"
          type="text"
          class="w-full rounded-md border border-neutral-300 px-3 py-2"
          placeholder="Enter your name"
        />
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium">Email</label>
        <input
          v-model="form.email"
          type="email"
          class="w-full rounded-md border border-neutral-300 px-3 py-2"
          placeholder="Enter your email"
        />
      </div>

      <button
        @click="submitForm"
        class="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-700"
      >
        Submit
      </button>
    </div>

    <div v-if="submitted" class="mt-4 rounded-md bg-green-50 p-4 text-green-800">
      Form submitted! Name: {{ form.name }}, Email: {{ form.email }}
    </div>
  </div>
</template>

<script setup>
const form = reactive({
  name: '',
  email: '',
});

const submitted = ref(false);

const submitForm = () => {
  submitted.value = true;
  setTimeout(() => {
    submitted.value = false;
  }, 3000);
};
</script>
```

---

## Tips for Success

### 1. Use Hot Reload
Changes you make are reflected instantly in the browser. Save your file and see the updates immediately!

### 2. Copy Existing Code
Don't start from scratch - copy existing pages or components and modify them. This is faster and helps you learn.

### 3. Use Browser DevTools
- Press `F12` to open DevTools
- Use the inspector to see what CSS classes are applied to elements
- Check the console for any errors

### 4. Experiment Freely
This environment is isolated - you can't break the main app! Try things out and see what works.

### 5. Check the Examples
Look at the existing prototype pages:
- `pages/prototype/index.vue` - Home page with cards
- `pages/prototype/dashboard.vue` - Dashboard with stats
- `pages/prototype/settings.vue` - Form inputs and toggles

### 6. Use the Quick Reference
See [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for a condensed lookup guide.

---

## Common Issues & Solutions

### Issue: "npm: command not found"
**Solution**: Install Node.js from [nodejs.org](https://nodejs.org/)

### Issue: Port 3000 is already in use
**Solution**: Stop other applications using port 3000, or change the port:
```bash
npm run dev -- --port 3001
```

### Issue: Changes not showing in browser
**Solution**:
1. Make sure you saved the file
2. Hard refresh the browser (Ctrl+Shift+R or Cmd+Shift+R)
3. Check the terminal for errors

### Issue: "Cannot find module"
**Solution**: Make sure you ran `npm install`

### Issue: Page shows blank or error
**Solution**:
1. Check the terminal for error messages
2. Make sure you added `layout: "prototype"` to `definePageMeta`
3. Check the browser console (F12) for JavaScript errors

---

## Getting Help

### Documentation
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Quick patterns lookup
- [TEMPLATE.vue](./TEMPLATE.vue) - Copy-paste page template
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/icons/)
- [Vue.js Guide](https://vuejs.org/guide/introduction.html)

### Example Pages
Look at these for reference:
- `pages/prototype/index.vue` - Home page
- `pages/prototype/dashboard.vue` - Dashboard with components
- `pages/prototype/settings.vue` - Forms and inputs

### Ask for Help
If you're stuck, ask a developer! They can:
- Create custom components for you
- Help debug issues
- Add new features to the prototype environment

---

## Current Prototype Pages

- **Home** (`/prototype`) - Overview and welcome page
- **Dashboard** (`/prototype/dashboard`) - Stats and activity example
- **Settings** (`/prototype/settings`) - Form inputs and toggles example

---

## Next Steps

1. ✅ Set up the project (you did this!)
2. 🎯 Create your first page using [TEMPLATE.vue](./TEMPLATE.vue)
3. 🎨 Experiment with styling using Tailwind classes
4. 🧩 Create reusable components
5. 🚀 Build your prototype!

**Happy prototyping!** 🎉
