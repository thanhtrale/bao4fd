<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Underline,
    Link.configure({ openOnClick: false }),
    Image,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Placeholder.configure({ placeholder: 'Nhập nội dung bài viết...' }),
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

watch(() => props.modelValue, (val) => {
  if (editor.value && editor.value.getHTML() !== val) {
    editor.value.commands.setContent(val, false)
  }
})

function setLink() {
  const url = prompt('URL:')
  if (url) {
    editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }
}

function addImage() {
  const url = prompt('Image URL:')
  if (url) {
    editor.value?.chain().focus().setImage({ src: url }).run()
  }
}
</script>

<template>
  <div class="border border-slate-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-accent/50 focus-within:border-accent transition-colors">
    <!-- Toolbar -->
    <div v-if="editor" class="flex flex-wrap gap-0.5 p-2 border-b border-slate-200 bg-slate-50">
      <button type="button" class="toolbar-btn" :class="{ active: editor.isActive('bold') }" @click="editor.chain().focus().toggleBold().run()" title="Bold">
        <strong>B</strong>
      </button>
      <button type="button" class="toolbar-btn" :class="{ active: editor.isActive('italic') }" @click="editor.chain().focus().toggleItalic().run()" title="Italic">
        <em>I</em>
      </button>
      <button type="button" class="toolbar-btn" :class="{ active: editor.isActive('underline') }" @click="editor.chain().focus().toggleUnderline().run()" title="Underline">
        <u>U</u>
      </button>
      <button type="button" class="toolbar-btn" :class="{ active: editor.isActive('strike') }" @click="editor.chain().focus().toggleStrike().run()" title="Strikethrough">
        <s>S</s>
      </button>

      <span class="w-px h-6 bg-slate-300 mx-1 self-center" />

      <button type="button" class="toolbar-btn" :class="{ active: editor.isActive('heading', { level: 2 }) }" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" title="Heading 2">
        H2
      </button>
      <button type="button" class="toolbar-btn" :class="{ active: editor.isActive('heading', { level: 3 }) }" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" title="Heading 3">
        H3
      </button>

      <span class="w-px h-6 bg-slate-300 mx-1 self-center" />

      <button type="button" class="toolbar-btn" :class="{ active: editor.isActive('bulletList') }" @click="editor.chain().focus().toggleBulletList().run()" title="Bullet list">
        •
      </button>
      <button type="button" class="toolbar-btn" :class="{ active: editor.isActive('orderedList') }" @click="editor.chain().focus().toggleOrderedList().run()" title="Numbered list">
        1.
      </button>
      <button type="button" class="toolbar-btn" :class="{ active: editor.isActive('blockquote') }" @click="editor.chain().focus().toggleBlockquote().run()" title="Blockquote">
        "
      </button>

      <span class="w-px h-6 bg-slate-300 mx-1 self-center" />

      <button type="button" class="toolbar-btn" :class="{ active: editor.isActive({ textAlign: 'left' }) }" @click="editor.chain().focus().setTextAlign('left').run()" title="Align left">
        ≡
      </button>
      <button type="button" class="toolbar-btn" :class="{ active: editor.isActive({ textAlign: 'center' }) }" @click="editor.chain().focus().setTextAlign('center').run()" title="Align center">
        ≡
      </button>
      <button type="button" class="toolbar-btn" :class="{ active: editor.isActive({ textAlign: 'right' }) }" @click="editor.chain().focus().setTextAlign('right').run()" title="Align right">
        ≡
      </button>

      <span class="w-px h-6 bg-slate-300 mx-1 self-center" />

      <button type="button" class="toolbar-btn" :class="{ active: editor.isActive('link') }" @click="setLink" title="Link">
        🔗
      </button>
      <button type="button" class="toolbar-btn" @click="addImage" title="Image">
        🖼
      </button>

      <span class="w-px h-6 bg-slate-300 mx-1 self-center" />

      <button type="button" class="toolbar-btn" @click="editor.chain().focus().setHorizontalRule().run()" title="Horizontal rule">
        ―
      </button>
      <button type="button" class="toolbar-btn" @click="editor.chain().focus().undo().run()" title="Undo">
        ↩
      </button>
      <button type="button" class="toolbar-btn" @click="editor.chain().focus().redo().run()" title="Redo">
        ↪
      </button>
    </div>

    <!-- Editor content -->
    <EditorContent :editor="editor" class="prose prose-sm max-w-none" />
  </div>
</template>

<style scoped>
.toolbar-btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  border-radius: 0.25rem;
  transition: background-color 0.15s;
  color: #475569;
  min-width: 28px;
  text-align: center;
}
.toolbar-btn:hover {
  background-color: #e2e8f0;
}
.toolbar-btn.active {
  background-color: rgba(37, 99, 235, 0.1);
  color: #2563eb;
  font-weight: 600;
}
:deep(.tiptap) {
  outline: none;
  min-height: 300px;
  padding: 1rem;
  cursor: text;
}
</style>
