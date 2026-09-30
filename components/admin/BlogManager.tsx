"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { Node, mergeAttributes } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Link from '@tiptap/extension-link';
import { Plus, Edit2, Trash2, Check, X, FileText, Globe, EyeOff, Save, Bold, Italic, List, ListOrdered, ImagePlus, Upload, Loader2, Images } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import toast from 'react-hot-toast';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Minimal image node so post-body images render in the editor without extra deps. */
const BlogImage = Node.create({
  name: 'blogImage',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
    };
  },
  parseHTML() { return [{ tag: 'img[src]' }]; },
  renderHTML({ HTMLAttributes }) { return ['img', mergeAttributes(HTMLAttributes)]; },
});

export default function BlogManager({ blogPosts, isDarkMode }: { blogPosts: any[], isDarkMode: boolean }) {
  const [posts, setPosts] = useState<any[]>(blogPosts || []);
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const [contentImages, setContentImages] = useState<any[]>([]);
  const [uploadingHeader, setUploadingHeader] = useState(false);
  const [uploadingContent, setUploadingContent] = useState(false);
  const [deleteArmedId, setDeleteArmedId] = useState<string | null>(null);
  const deleteArmTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editorEverFocused = useRef(false);
  const headerFileRef = useRef<HTMLInputElement>(null);
  const contentFileRef = useRef<HTMLInputElement>(null);

  // Load content images whenever the edited post changes
  useEffect(() => {
    if (editingPost?.id) {
      fetch(`/api/admin/blog/images?post_id=${editingPost.id}`)
        .then(r => r.json())
        .then(d => { if (Array.isArray(d)) setContentImages(d); })
        .catch(() => {});
    } else {
      setContentImages([]);
    }
    setEditorInstance(null);
  }, [editingPost?.id]);

  const uploadImage = async (file: File, kind: 'header' | 'content', caption = '') => {
    if (!editingPost?.id) {
      toast.error('Save the post first, then add images');
      return null;
    }
    const form = new FormData();
    form.append('file', file);
    form.append('post_id', editingPost.id);
    form.append('kind', kind);
    if (caption) form.append('caption', caption);
    const res = await fetch('/api/admin/blog/images', { method: 'POST', body: form });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data;
  };

  const handleHeaderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingHeader(true);
    try {
      const data = await uploadImage(file, 'header');
      if (data) {
        setEditingPost({ ...editingPost, header_image: data.image_url });
        toast.success('Header image uploaded');
      }
    } catch (err: any) {
      toast.error(err.message || 'Header upload failed');
    } finally {
      setUploadingHeader(false);
      if (headerFileRef.current) headerFileRef.current.value = '';
    }
  };

  const handleHeaderRemove = async () => {
    if (!editingPost?.id || !editingPost.header_image) return;
    if (!confirm('Remove the header image?')) return;
    try {
      const res = await fetch(`/api/admin/blog/images?post_id=${editingPost.id}&kind=header`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to remove header image');
      setEditingPost({ ...editingPost, header_image: '' });
      toast.success('Header image removed');
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove header image');
    }
  };

  const handleContentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploadingContent(true);
    try {
      for (const file of files) {
        const data = await uploadImage(file, 'content');
        if (data) setContentImages(prev => [...prev, data]);
      }
      toast.success(files.length === 1 ? 'Image uploaded' : `${files.length} images uploaded`);
    } catch (err: any) {
      toast.error(err.message || 'Image upload failed');
    } finally {
      setUploadingContent(false);
      if (contentFileRef.current) contentFileRef.current.value = '';
    }
  };

  const handleCaptionSave = async (img: any, caption: string) => {
    try {
      const res = await fetch('/api/admin/blog/images', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: img.id, caption }),
      });
      if (!res.ok) throw new Error('Failed to save caption');
      setContentImages(prev => prev.map(i => i.id === img.id ? { ...i, caption } : i));
    } catch (err: any) {
      toast.error(err.message || 'Failed to save caption');
    }
  };

  const handleImageDelete = async (img: any) => {
    // Two-click inline confirm (native confirm() dialogs are unreliable in
    // embedded/automated browsers and get silently dismissed).
    if (deleteArmedId !== img.id) {
      setDeleteArmedId(img.id);
      if (deleteArmTimer.current) clearTimeout(deleteArmTimer.current);
      deleteArmTimer.current = setTimeout(() => {
        setDeleteArmedId((cur) => (cur === img.id ? null : cur));
      }, 5000);
      return;
    }
    setDeleteArmedId(null);
    if (deleteArmTimer.current) clearTimeout(deleteArmTimer.current);
    try {
      const res = await fetch(`/api/admin/blog/images?id=${img.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete image');
      setContentImages(prev => prev.filter(i => i.id !== img.id));
      toast.success('Image deleted');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete image');
    }
  };

  const insertImageIntoPost = (img: any) => {
    if (!editorInstance) {
      toast.error('Editor is not ready yet');
      return;
    }
    const node = { type: 'blogImage', attrs: { src: img.image_url, alt: img.caption || '' } };
    let inserted = false;
    if (editorEverFocused.current) {
      // Editor had a cursor before — restore it and insert there.
      inserted = editorInstance.chain().focus().insertContent(node).run();
    }
    if (!inserted) {
      // No cursor was ever placed in the editor — append at the end of the document.
      try {
        const endPos = editorInstance.state.doc.content.size;
        inserted = editorInstance.chain().setTextSelection(endPos).insertContent(node).run();
      } catch { /* fall through to the error toast below */ }
    }
    if (!inserted) {
      toast.error('Could not insert image — click inside the post content first, then try again.');
      return;
    }
    const html = editorInstance.getHTML();
    setEditingPost({ ...editingPost, content: html });
    toast.success('Image inserted into post');
  };

  const handleEdit = (post: any) => {
    setEditingPost({ ...post });
  };

  const handleCreate = () => {
    setEditingPost({
      title: '',
      slug: '',
      content: '',
      meta_description: '',
      header_image: '',
      is_published: false
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete');
      
      setPosts(posts.filter(p => p.id !== id));
      toast.success('Post deleted');
    } catch (err: any) {
      toast.error(err.message || 'Error deleting post');
    }
  };

  const handleSave = async () => {
    if (!editingPost.title || !editingPost.slug || !editingPost.content) {
      toast.error('Title, slug, and content are required');
      return;
    }
    
    setIsSaving(true);
    try {
      const isNew = !editingPost.id;
      const url = isNew ? '/api/admin/blog' : `/api/admin/blog/${editingPost.id}`;
      const method = isNew ? 'POST' : 'PUT';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPost)
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }
      
      const savedPost = await res.json();
      
      if (isNew) {
        setPosts([savedPost, ...posts]);
      } else {
        setPosts(posts.map(p => p.id === savedPost.id ? savedPost : p));
      }
      
      toast.success('Post saved successfully');
      setEditingPost(null);
    } catch (err: any) {
      toast.error(err.message || 'Error saving post');
    } finally {
      setIsSaving(false);
    }
  };

  if (editingPost) {
    return (
      <div className="animate-in fade-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{editingPost.id ? 'Edit Post' : 'Create New Post'}</h2>
          <div className="flex gap-3">
            <button 
              onClick={() => setEditingPost(null)}
              className={cn("px-4 py-2 rounded-lg font-medium transition-colors", isDarkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200")}
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {isSaving ? <span className="animate-spin text-xl leading-none">⟳</span> : <Save size={18} />}
              {isSaving ? 'Saving...' : 'Save Post'}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className={cn("p-6 rounded-xl border shadow-sm", isDarkMode ? "bg-[#0A0A0A] border-gray-800" : "bg-white border-gray-200")}>
              <div className="space-y-4">
                <div>
                  <label className={cn("block text-sm font-medium mb-1", isDarkMode ? "text-gray-300" : "text-gray-700")}>Title</label>
                  <input 
                    type="text" 
                    value={editingPost.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                      setEditingPost({ ...editingPost, title, slug: editingPost.id ? editingPost.slug : slug });
                    }}
                    className={cn("w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all", isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300")}
                    placeholder="E.g. How to Write a Winning Resume"
                  />
                </div>
                
                <div>
                  <label className={cn("block text-sm font-medium mb-1", isDarkMode ? "text-gray-300" : "text-gray-700")}>Content</label>
                  <div className={cn("border rounded-lg overflow-hidden", isDarkMode ? "border-gray-700" : "border-gray-300")}>
                    <TiptapEditor 
                      key={editingPost.id || 'new'}
                      content={editingPost.content} 
                      onChange={(content) => setEditingPost({ ...editingPost, content })}
                      onReady={(editor) => { editorEverFocused.current = false; setEditorInstance(editor); }}
                      onFocus={() => { editorEverFocused.current = true; }}
                      isDarkMode={isDarkMode}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className={cn("p-6 rounded-xl border shadow-sm", isDarkMode ? "bg-[#0A0A0A] border-gray-800" : "bg-white border-gray-200")}>
              <h3 className="font-bold text-lg mb-4">Post Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className={cn("block text-sm font-medium mb-1", isDarkMode ? "text-gray-300" : "text-gray-700")}>URL Slug</label>
                  <input 
                    type="text" 
                    value={editingPost.slug}
                    onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                    className={cn("w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all", isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300")}
                    placeholder="how-to-write-a-winning-resume"
                  />
                </div>
                
                <div>
                  <label className={cn("block text-sm font-medium mb-1", isDarkMode ? "text-gray-300" : "text-gray-700")}>Meta Description</label>
                  <textarea 
                    value={editingPost.meta_description || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, meta_description: e.target.value })}
                    rows={3}
                    className={cn("w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all", isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300")}
                    placeholder="Brief summary for SEO..."
                  />
                </div>
                
                <div className={cn("rounded-xl border p-4", isDarkMode ? "border-gray-700 bg-gray-900/40" : "border-gray-200 bg-gray-50")}>
                  <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                    <ImagePlus size={16} className="text-blue-500" />
                    Post Images
                  </h4>

                  {/* Header image */}
                  <label className={cn("block text-xs font-semibold uppercase tracking-wider mb-1", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                    Header image
                  </label>
                  <input ref={headerFileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleHeaderUpload} />
                  {editingPost.header_image ? (
                    <div className="relative rounded-lg overflow-hidden border border-gray-700">
                      <img src={editingPost.header_image} alt="Header preview" className="w-full h-32 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button
                          onClick={() => headerFileRef.current?.click()}
                          disabled={uploadingHeader}
                          className="px-2.5 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1.5 shadow"
                        >
                          {uploadingHeader ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                          Replace
                        </button>
                        <button
                          onClick={handleHeaderRemove}
                          className="px-2.5 py-1.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-1.5 shadow"
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => editingPost.id ? headerFileRef.current?.click() : toast.error('Save the post first, then add a header image')}
                      disabled={uploadingHeader}
                      className={cn("w-full py-6 rounded-lg border-2 border-dashed text-sm font-medium flex flex-col items-center gap-2 transition-colors", isDarkMode ? "border-gray-700 text-gray-400 hover:border-blue-500 hover:text-blue-400" : "border-gray-300 text-gray-500 hover:border-blue-500 hover:text-blue-600")}
                    >
                      {uploadingHeader ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
                      {uploadingHeader ? 'Uploading…' : 'Upload header image'}
                    </button>
                  )}
                  <input
                    type="text"
                    value={editingPost.header_image || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, header_image: e.target.value })}
                    className={cn("mt-2 w-full px-3 py-2 text-xs rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono", isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300")}
                    placeholder="…or paste an image URL"
                  />
                  <p className={cn("text-xs mt-1", isDarkMode ? "text-gray-500" : "text-gray-400")}>
                    Used as the hero image and OpenGraph image for social sharing.
                  </p>

                  {/* Content images */}
                  <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <label className={cn("text-xs font-semibold uppercase tracking-wider", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                        Content images ({contentImages.length})
                      </label>
                      <button
                        onClick={() => editingPost.id ? contentFileRef.current?.click() : toast.error('Save the post first, then add images')}
                        disabled={uploadingContent}
                        className="px-2.5 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1.5"
                      >
                        {uploadingContent ? <Loader2 size={14} className="animate-spin" /> : <Images size={14} />}
                        {uploadingContent ? 'Uploading…' : 'Add images'}
                      </button>
                    </div>
                    <input ref={contentFileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple className="hidden" onChange={handleContentUpload} />
                    {!editingPost.id && (
                      <p className={cn("text-xs", isDarkMode ? "text-gray-500" : "text-gray-400")}>
                        Save the post first to attach images.
                      </p>
                    )}
                    {contentImages.length > 0 && (
                      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                        {contentImages.map((img) => (
                          <div key={img.id} className={cn("flex gap-2 p-2 rounded-lg border", isDarkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white")}>
                            <img src={img.image_url} alt={img.caption || 'Content image'} className="w-16 h-16 object-cover rounded-md border border-gray-700/50 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <input
                                type="text"
                                defaultValue={img.caption || ''}
                                onBlur={(e) => { if (e.target.value !== (img.caption || '')) handleCaptionSave(img, e.target.value); }}
                                placeholder="Caption (alt text)…"
                                className={cn("w-full px-2 py-1 text-xs rounded border outline-none focus:ring-1 focus:ring-blue-500", isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-300")}
                              />
                              <div className="flex gap-1 mt-1.5">
                                <button
                                  onClick={() => insertImageIntoPost(img)}
                                  className="px-2 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded flex items-center gap-1"
                                >
                                  <ImagePlus size={12} />
                                  Insert into post
                                </button>
                                <button
                                  onClick={() => handleImageDelete(img)}
                                  className={cn(
                                    "px-2 py-1 text-[11px] font-bold rounded flex items-center gap-1",
                                    deleteArmedId === img.id
                                      ? "bg-red-600 text-white hover:bg-red-700"
                                      : "bg-red-600/10 hover:bg-red-600/20 text-red-500"
                                  )}
                                >
                                  <Trash2 size={12} />
                                  {deleteArmedId === img.id ? 'Confirm delete?' : 'Delete'}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className={cn("text-xs mt-2", isDarkMode ? "text-gray-500" : "text-gray-400")}>
                      Insert images into the post at your cursor. They render framed in the article style.
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-700">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only"
                        checked={editingPost.is_published}
                        onChange={(e) => setEditingPost({ ...editingPost, is_published: e.target.checked })}
                      />
                      <div className={cn("block w-10 h-6 rounded-full transition-colors", editingPost.is_published ? "bg-blue-600" : "bg-gray-600")}></div>
                      <div className={cn("dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform", editingPost.is_published ? "translate-x-4" : "")}></div>
                    </div>
                    <div className="font-medium">
                      Publish Post
                      <p className={cn("text-xs font-normal", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                        {editingPost.is_published ? 'Visible to public' : 'Hidden as draft'}
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Blog CMS</h2>
          <p className={cn("text-sm", isDarkMode ? "text-gray-400" : "text-gray-500")}>Manage your SEO content and marketing articles.</p>
        </div>
        <button 
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20"
        >
          <Plus size={18} />
          Create Post
        </button>
      </div>

      <div className={cn("rounded-xl border shadow-sm overflow-hidden transition-colors", isDarkMode ? "bg-[#0A0A0A] border-gray-800" : "bg-white border-gray-200")}>
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className={cn("text-xs uppercase font-semibold border-b transition-colors tracking-wider", isDarkMode ? "bg-gray-900/50 text-gray-400 border-gray-800" : "bg-gray-50 text-gray-500 border-gray-200")}>
            <tr>
              <th className="px-6 py-4">Post Title & Slug</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className={cn("divide-y transition-colors", isDarkMode ? "divide-gray-800" : "divide-gray-100")}>
            {posts.map((post) => (
              <tr key={post.id} className={cn("transition-colors", isDarkMode ? "hover:bg-gray-900/30" : "hover:bg-gray-50")}>
                <td className="px-6 py-4">
                  <div className="font-bold text-base flex items-center gap-2">
                    <FileText size={16} className="text-blue-500" />
                    {post.title}
                  </div>
                  <div className={cn("text-xs mt-1 font-mono", isDarkMode ? "text-gray-500" : "text-gray-400")}>
                    /blog/{post.slug}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {post.is_published ? (
                    <span className={cn("px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1 w-max", isDarkMode ? "bg-emerald-900/30 text-emerald-400" : "bg-emerald-100 text-emerald-700")}>
                      <Globe size={12} /> Published
                    </span>
                  ) : (
                    <span className={cn("px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1 w-max", isDarkMode ? "bg-amber-900/30 text-amber-400" : "bg-amber-100 text-amber-700")}>
                      <EyeOff size={12} /> Draft
                    </span>
                  )}
                </td>
                <td className={cn("px-6 py-4", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                  {new Date(post.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleEdit(post)}
                      className={cn("p-2 rounded-lg transition-colors", isDarkMode ? "hover:bg-gray-800 text-gray-400 hover:text-white" : "hover:bg-gray-100 text-gray-500 hover:text-gray-900")}
                      title="Edit post"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(post.id)}
                      className="p-2 rounded-lg transition-colors hover:bg-red-500/10 text-red-500"
                      title="Delete post"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={4} className={cn("px-6 py-12 text-center", isDarkMode ? "text-gray-500 bg-gray-900/50" : "text-gray-500 bg-gray-50")}>
                  No blog posts found. Create your first post!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Tiptap Editor Component
const MenuBar = ({ editor, isDarkMode }: { editor: any, isDarkMode: boolean }) => {
  if (!editor) return null;
  
  return (
    <div className={cn("flex flex-wrap gap-1 p-2 border-b", isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-300")}>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={cn("p-1.5 rounded transition-colors", editor.isActive('bold') ? (isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black") : (isDarkMode ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"))}
      >
        <Bold size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={cn("p-1.5 rounded transition-colors", editor.isActive('italic') ? (isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black") : (isDarkMode ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"))}
      >
        <Italic size={16} />
      </button>
      
      <div className="w-px h-6 bg-gray-600 mx-1 self-center"></div>
      
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={cn("px-2 py-1 text-sm font-bold rounded transition-colors", editor.isActive('heading', { level: 2 }) ? (isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black") : (isDarkMode ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"))}
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={cn("px-2 py-1 text-sm font-bold rounded transition-colors", editor.isActive('heading', { level: 3 }) ? (isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black") : (isDarkMode ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"))}
      >
        H3
      </button>
      
      <div className="w-px h-6 bg-gray-600 mx-1 self-center"></div>
      
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn("p-1.5 rounded transition-colors", editor.isActive('bulletList') ? (isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black") : (isDarkMode ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"))}
      >
        <List size={16} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn("p-1.5 rounded transition-colors", editor.isActive('orderedList') ? (isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black") : (isDarkMode ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"))}
      >
        <ListOrdered size={16} />
      </button>
    </div>
  );
};

const TiptapEditor = ({ content, onChange, onReady, onFocus, isDarkMode }: { content: string, onChange: (html: string) => void, onReady?: (editor: any) => void, onFocus?: () => void, isDarkMode: boolean }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      BlogImage,
      Heading.configure({ levels: [1, 2, 3] }),
      Link.configure({ openOnClick: false })
    ],
    content: content || '<p>Start writing your post here...</p>',
    onCreate: ({ editor }) => { onReady?.(editor); },
    onFocus: () => { onFocus?.(); },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn('prose max-w-none p-4 min-h-[400px] outline-none', isDarkMode ? 'prose-invert' : ''),
      },
    },
  });

  return (
    <div className={cn("flex flex-col h-full", isDarkMode ? "bg-gray-900" : "bg-white")}>
      <style>{`.ProseMirror img{max-width:100%;height:auto;border:3px solid #151a46;margin:0.75em 0;display:block;}`}</style>
      <MenuBar editor={editor} isDarkMode={isDarkMode} />
      <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
    </div>
  );
};
