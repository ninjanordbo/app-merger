# Quick Reference Guide

## File Locations

| What | Where | Example |
|------|-------|---------|
| Pages | `/pages/prototype/` | `/pages/prototype/my-page.vue` |
| Components | `/components/prototype/` | `/components/prototype/MyCard.vue` |
| Store | `/store/prototype/` | `/store/prototype/app.ts` |
| Layout | `/layouts/` | `/layouts/prototype.vue` |

## Routes

All prototype pages are under the `/prototype` prefix:
- Home: `/prototype`
- Dashboard: `/prototype/dashboard`
- Settings: `/prototype/settings`
- Your page: `/prototype/your-page-name`

## Component Naming

Nuxt auto-imports components based on their location:
- File: `/components/prototype/MyCard.vue`
- Use as: `<PrototypeMyCard />`

## Common Patterns

### Card Container
```vue
<div class="rounded-lg border border-neutral-200 bg-white p-6">
  <!-- content -->
</div>
```

### Grid Layout
```vue
<!-- 1 col mobile, 2 col tablet, 3 col desktop -->
<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  <!-- items -->
</div>
```

### Button Primary
```vue
<button class="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-700">
  Button Text
</button>
```

### Button Secondary
```vue
<button class="rounded-md border border-primary bg-white px-4 py-2 text-primary hover:bg-primary/5">
  Button Text
</button>
```

### Icon with Text
```vue
<div class="flex items-center gap-2">
  <LucideHome :size="20" />
  <span>Home</span>
</div>
```

### Spacing
```vue
<!-- Vertical spacing between elements -->
<div class="space-y-6">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Gap in flex/grid -->
<div class="flex gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

## Colors

### Background
- `bg-white` - White
- `bg-neutral-50` - Light gray
- `bg-neutral-100` - Lighter gray
- `bg-primary` - Primary color (blue)
- `bg-primary/10` - 10% opacity primary

### Text
- `text-neutral-900` - Dark (headings)
- `text-neutral-600` - Medium (body text)
- `text-neutral-500` - Light (secondary text)
- `text-primary` - Primary color
- `text-white` - White

### Borders
- `border-neutral-200` - Standard border
- `border-primary` - Primary color border

## Sizing

### Width/Height
- `w-full` - 100% width
- `w-1/2` - 50% width
- `h-screen` - 100vh height
- `size-12` - width and height 3rem (48px)

### Padding
- `p-4` - All sides
- `px-6` - Horizontal (left + right)
- `py-2` - Vertical (top + bottom)
- `pt-4` - Top only

### Margin
- `m-4` - All sides
- `mt-6` - Top only
- `mb-4` - Bottom only

## Text Styling

- `text-sm` - Small (14px)
- `text-base` - Base (16px)
- `text-lg` - Large (18px)
- `text-xl` - Extra large (20px)
- `text-2xl` - 2X large (24px)

- `font-medium` - Medium weight (500)
- `font-semibold` - Semibold (600)
- `font-bold` - Bold (700)

## Icons

Import and use:
```vue
<template>
  <LucideHome :size="20" />
</template>
```

Common icons:
- `LucideHome`
- `LucideSettings`
- `LucideUsers`
- `LucideLayoutDashboard`
- `LucidePlus`
- `LucideSave`
- `LucideCheck`
- `LucideX`
- `LucideRocket`
- `LucideLogOut`
- `LucideChevronLeft`
- `LucideChevronRight`

[Browse all icons](https://lucide.dev/icons/)

## Store Usage

```vue
<script setup>
const store = usePrototypeAppStore();

// Read state
console.log(store.counter);
console.log(store.message);

// Read getters
console.log(store.doubleCounter);

// Call actions
store.increment();
store.decrement();
store.setMessage("New message");
</script>
```

## Interactive Elements

### Click Handler
```vue
<button @click="handleClick">Click Me</button>

<script setup>
const handleClick = () => {
  console.log('Clicked!');
};
</script>
```

### Input Binding
```vue
<input v-model="inputValue" type="text" />

<script setup>
const inputValue = ref('');
</script>
```

### Toggle
```vue
<button @click="isOpen = !isOpen">
  Toggle
</button>
<div v-if="isOpen">Content</div>

<script setup>
const isOpen = ref(false);
</script>
```

### List Rendering
```vue
<div v-for="item in items" :key="item.id">
  {{ item.name }}
</div>

<script setup>
const items = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
];
</script>
```

## Responsive Design

Breakpoints:
- `sm:` - 640px and up
- `md:` - 768px and up
- `lg:` - 1024px and up
- `xl:` - 1280px and up

Example:
```vue
<div class="text-sm md:text-base lg:text-lg">
  Responsive text size
</div>
```

## Hover Effects

```vue
<button class="hover:bg-primary-700">
  Hover Me
</button>
```

## Transitions

```vue
<button class="transition-colors hover:bg-primary-700">
  Smooth transition
</button>
```

## Need More?

Check the full [README.md](./README.md) for detailed explanations and examples!
