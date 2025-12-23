import React, { useState, useEffect, useContext } from "react";
import { StoreContext } from "@/context/StoreContext";
import {
  Loader2,
  PlusCircle,
  Trash2,
  Edit2,
  ImageIcon,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/* ---------------- BLOG FORM ---------------- */

const BlogForm = ({
  formData,
  setFormData,
  handleSubmit,
  isEditing,
  submitting,
  onCancel,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        placeholder="Blog Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />

      <Textarea
        placeholder="Blog Content"
        value={formData.content}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        className="min-h-[200px]"
        required
      />

      <Input
        placeholder="Image URL"
        value={formData.image}
        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
        required
      />

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={submitting}
          className="bg-[#009a8d] hover:bg-[#008075]"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : isEditing ? (
            "Update Blog"
          ) : (
            "Create Blog"
          )}
        </Button>
      </div>
    </form>
  );
};

/* ---------------- BLOG MANAGEMENT ---------------- */

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [openShareId, setOpenShareId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
  });

  const { url } = useContext(StoreContext);
  const token = localStorage.getItem("token");
  const { toast } = useToast();

  /* ---------------- SHARE LOGIC ---------------- */

  const handleShare = (blog, platform) => {
    const shareLink = `${window.location.origin}/blogs?blog=${blog._id}`;
    const text = encodeURIComponent(blog.title);

    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareLink
        )}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(
          shareLink
        )}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
          shareLink
        )}&title=${text}`;
        break;
      case "copy":
        navigator.clipboard.writeText(shareLink);
        toast({ title: "Blog link copied!" });
        setOpenShareId(null);
        return;
      default:
        return;
    }

    window.open(shareUrl, "_blank");
    setOpenShareId(null);
  };

  /* ---------------- FETCH BLOGS ---------------- */

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${url}/api/blogs`);
      setBlogs(res.data.blogs || []);
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch blogs",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      image: blog.image,
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (isEditing) {
        await axios.put(`${url}/api/blogs/${editingBlog._id}`, formData, {
          headers: { token },
        });
        toast({ title: "Blog updated successfully" });
      } else {
        await axios.post(`${url}/api/blogs/create`, formData, {
          headers: { token },
        });
        toast({ title: "Blog created successfully" });
      }
      resetForm();
      fetchBlogs();
    } catch {
      toast({ variant: "destructive", title: "Operation failed" });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", content: "", image: "" });
    setIsEditing(false);
    setEditingBlog(null);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    // Show a toast-based confirmation with actionable buttons.
    const t = toast({
      title: "Confirm delete",
      description: "Are you sure you want to delete this blog?",
    });

    // Add action buttons to the toast (use update so we can reference the toast handle)
    t.update({
      action: (
        <div className="flex items-center gap-2">
          <button
            onClick={async (e) => {
              e.stopPropagation();
              t.dismiss();
              try {
                setLoading(true);
                await axios.delete(`${url}/api/blogs/${id}`, {
                  headers: { token },
                });
                toast({ title: "Blog deleted" });
                fetchBlogs();
              } catch (err) {
                toast({ variant: "destructive", title: "Delete failed" });
              } finally {
                setLoading(false);
              }
            }}
            className="px-3 py-1 bg-red-600 text-white rounded-md text-sm"
          >
            Delete
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              t.dismiss();
            }}
            className="px-3 py-1 border rounded-md text-sm"
          >
            Cancel
          </button>
        </div>
      ),
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Toaster />

      {/* HEADER */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Blog Management</h1>
          <p className="text-gray-500">Create, edit & share blogs</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-[#009a8d]">
          <PlusCircle className="w-4 h-4 mr-2" />
          New Blog
        </Button>
      </div>

      {/* FORM DIALOG */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Blog" : "Create Blog"}
            </DialogTitle>
            <DialogDescription>
              Manage your blog content here
            </DialogDescription>
          </DialogHeader>
          <BlogForm
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            isEditing={isEditing}
            submitting={submitting}
            onCancel={resetForm}
          />
        </DialogContent>
      </Dialog>

      {/* BLOG CARDS */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {blogs.map((blog) => (
            <motion.div key={blog._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="group hover:shadow-xl transition">
                {/* Image wrapper - keep clipping for image but allow dropdown to overflow */}
                <div className="relative h-48">
                  <div className="h-48 overflow-hidden rounded-t-xl">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>

                  {/* ACTION BUTTONS (placed in outer relative so dropdown can overflow) */}
                  <div className="absolute bottom-4 right-4 z-50 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => handleEdit(blog)}
                    >
                      <Edit2 size={16} />
                    </Button>

                    {/* SHARE */}
                    <div className="relative">
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenShareId(
                            openShareId === blog._id ? null : blog._id
                          );
                        }}
                      >
                        <Share2 size={16} />
                      </Button>

                      {openShareId === blog._id && (
                        <div className="absolute right-0 top-10 z-50 w-44 rounded-xl border bg-white shadow-lg">
                          <button
                            onClick={() => handleShare(blog, "facebook")}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-gray-100"
                          >
                            <Facebook className="w-4 h-4 text-blue-600" />
                            Facebook
                          </button>
                          <button
                            onClick={() => handleShare(blog, "twitter")}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-gray-100"
                          >
                            <Twitter className="w-4 h-4 text-sky-500" />
                            Twitter
                          </button>
                          <button
                            onClick={() => handleShare(blog, "linkedin")}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-gray-100"
                          >
                            <Linkedin className="w-4 h-4 text-blue-700" />
                            LinkedIn
                          </button>
                          <div className="h-px bg-gray-200 my-1" />
                          <button
                            onClick={() => handleShare(blog, "copy")}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-gray-100"
                          >
                            <LinkIcon className="w-4 h-4 text-gray-600" />
                            Copy link
                          </button>
                        </div>
                      )}
                    </div>

                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDelete(blog._id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-bold text-lg line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {blog.content}
                  </p>
                </CardContent>

                <CardFooter className="flex justify-between text-sm text-gray-500">
                  <span>{format(new Date(blog.createdAt), "MMM d, yyyy")}</span>
                  <span>
                    {Math.ceil(blog.content.split(" ").length / 200)} min
                  </span>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {!loading && blogs.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No blogs yet</p>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;
