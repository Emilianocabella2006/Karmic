import { useState, useRef, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  displayName?: string;
  bio?: string;
  website?: string;
  avatarUrl?: string;
  createdAt: string;
}

interface ProfileEditFormProps {
  user: User;
  onUpdate: (updatedUser: User) => void;
}

export default function ProfileEditForm({ user, onUpdate }: ProfileEditFormProps) {
  const [formData, setFormData] = useState<User>(user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No estás autenticado.");

      const response = await fetch("/api/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          displayName: formData.displayName,
          bio: formData.bio,
          website: formData.website,
          avatarUrl: formData.avatarUrl,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error al actualizar.");

      onUpdate(data);
      setIsOpen(false);
      alert("Perfil actualizado con éxito.");
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "Error desconocido.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative mb-6" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition"
      >
        Editar Perfil
      </button>
    
      {isOpen && (
        <div className="absolute z-10 mt-2 w-80 bg-white p-4 rounded-lg shadow-xl border border-gray-200 transition-all duration-200">
          {formData.avatarUrl && (
            <div className="mb-4 text-center">
              <img
          src={formData.avatarUrl}
          alt="Vista previa del avatar"
          className="w-20 h-20 rounded-full mx-auto object-cover border"
              />
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre público
              </label>
              <input
          name="displayName"
          value={formData.displayName || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
          Biografía
              </label>
              <textarea
          name="bio"
          value={formData.bio || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          rows={3}
              />
            </div>

<div className="mb-3">
  <label className="block text-sm font-medium text-gray-700 mb-1">Avatar (URL de imagen)</label>
  <input
    name="avatarUrl"
    value={formData.avatarUrl || ""}
    onChange={handleChange}
    className="w-full p-2 border rounded text-sm"
    type="url"
    placeholder="https://gravatar.com/avatar/341936020b420622577213da36c52905?s=400&d=mp&r=x"
  />
</div>


            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
          Sitio web
              </label>
              <input
          name="website"
          value={formData.website || ""}
          onChange={handleChange}
          type="url"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="px-4 py-1 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
          Cancelar
              </button>
              <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
          {isSubmitting ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
