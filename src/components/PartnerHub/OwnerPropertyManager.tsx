import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useOwnerProperties } from '@/hooks/useOwnerProperties';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Trash2, Edit2, Plus, X } from 'lucide-react';
import type { ApartmentType, OwnerProperty } from '@/data/partnerHub';

const APARTMENT_TYPES: ApartmentType[] = ['Tipo A', 'Tipo B', 'Tipo C', 'Tipo D'];

const propertySchema = z.object({
  propertyName: z.string().min(2, 'Property name is required'),
  apartmentType: z.enum(['Tipo A', 'Tipo B', 'Tipo C', 'Tipo D'], {
    errorMap: () => ({ message: 'Please select apartment type' }),
  }),
  googleDriveLink: z.string().url('Invalid URL').refine(
    (url) => url.includes('drive.google.com'),
    'Must be a valid Google Drive link'
  ),
  iCalLink: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type PropertyFormData = z.infer<typeof propertySchema>;

interface OwnerPropertyManagerProps {
  ownerId: string;
}

export function OwnerPropertyManager({ ownerId }: OwnerPropertyManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { getProperties, addProperty, updateProperty, deleteProperty } = useOwnerProperties(ownerId);
  const { toast } = useToast();
  const properties = getProperties();

  const editingProperty = editingId ? properties.find((p) => p.id === editingId) : null;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: editingProperty
      ? {
          propertyName: editingProperty.propertyName,
          apartmentType: editingProperty.apartmentType,
          googleDriveLink: editingProperty.googleDriveLink,
          iCalLink: editingProperty.iCalLink || '',
        }
      : {
          propertyName: '',
          apartmentType: 'Tipo A',
          googleDriveLink: '',
          iCalLink: '',
        },
  });

  // Sync form values when switching to edit mode
  useEffect(() => {
    if (editingId && editingProperty) {
      reset({
        propertyName: editingProperty.propertyName,
        apartmentType: editingProperty.apartmentType,
        googleDriveLink: editingProperty.googleDriveLink,
        iCalLink: editingProperty.iCalLink || '',
      });
    } else if (!editingId) {
      reset({
        propertyName: '',
        apartmentType: 'Tipo A',
        googleDriveLink: '',
        iCalLink: '',
      });
    }
  }, [editingId, editingProperty, reset]);

  const onSubmit = async (data: PropertyFormData) => {
    try {
      setIsSaving(true);

      if (editingId) {
        updateProperty(editingId, {
          propertyName: data.propertyName,
          apartmentType: data.apartmentType,
          googleDriveLink: data.googleDriveLink,
          iCalLink: data.iCalLink || undefined,
        });
        toast({
          title: 'Success',
          description: 'Property updated successfully.',
          variant: 'default',
        });
      } else {
        addProperty({
          ownerId,
          propertyName: data.propertyName,
          apartmentType: data.apartmentType,
          googleDriveLink: data.googleDriveLink,
          iCalLink: data.iCalLink || undefined,
        });
        toast({
          title: 'Success',
          description: 'Property added successfully.',
          variant: 'default',
        });
      }

      reset();
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save property. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      try {
        deleteProperty(id);
        toast({
          title: 'Success',
          description: 'Property deleted successfully.',
          variant: 'default',
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete property. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleEdit = (property: OwnerProperty) => {
    setEditingId(property.id);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingId(null);
    reset();
  };

  return (
    <div className="space-y-6">
      {/* Properties List */}
      {properties.length > 0 && (
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 text-lg">My Properties</h3>
            <div className="divide-y">
              {properties.map((prop) => (
                <div key={prop.id} className="py-4 flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{prop.propertyName}</h4>
                    <p className="text-sm text-gray-600">
                      {prop.apartmentType} • {prop.googleDriveLink.substring(0, 50)}...
                    </p>
                    {prop.iCalLink && (
                      <p className="text-xs text-gray-500 mt-1">
                        📅 Calendar link available
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(prop)}
                      className="text-[#D4A843] border-[#D4A843] hover:bg-amber-50"
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(prop.id)}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="p-6 border-[#D4A843]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 text-lg">
              {editingId ? 'Edit Property' : 'Add New Property'}
            </h3>
            <button
              onClick={handleCloseForm}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Name
              </label>
              <Input
                type="text"
                {...register('propertyName')}
                placeholder="e.g., Beachfront Studio"
              />
              {errors.propertyName && (
                <p className="text-red-500 text-sm mt-1">{errors.propertyName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apartment Type
              </label>
              <select
                {...register('apartmentType')}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A843]"
              >
                {APARTMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.apartmentType && (
                <p className="text-red-500 text-sm mt-1">{errors.apartmentType.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Google Drive Photos Link
              </label>
              <Input
                type="url"
                {...register('googleDriveLink')}
                placeholder="https://drive.google.com/drive/folders/..."
              />
              {errors.googleDriveLink && (
                <p className="text-red-500 text-sm mt-1">{errors.googleDriveLink.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                iCal/Calendar Link (Optional)
              </label>
              <Input
                type="url"
                {...register('iCalLink')}
                placeholder="https://calendar.google.com/calendar/ical/..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Share your Google Calendar availability link so admins can see when your property is available
              </p>
              {errors.iCalLink && (
                <p className="text-red-500 text-sm mt-1">{errors.iCalLink.message}</p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseForm}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-[#D4A843] hover:bg-[#c9963e] text-black font-semibold"
              >
                {isSaving ? 'Saving...' : editingId ? 'Update Property' : 'Add Property'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Empty State with Add Button */}
      {properties.length === 0 && !showForm && (
        <Card className="p-12 text-center">
          <div className="space-y-4">
            <p className="text-gray-600">No properties added yet.</p>
            <p className="text-sm text-gray-500">
              Create your first property to get started with offering on requirements.
            </p>
            <Button
              type="button"
              onClick={() => setShowForm(true)}
              className="bg-[#D4A843] hover:bg-[#c9963e] text-black font-semibold"
            >
              <Plus size={18} className="mr-2" />
              Add Your First Property
            </Button>
          </div>
        </Card>
      )}

      {/* Add Button (when not showing form) */}
      {properties.length > 0 && !showForm && (
        <Button
          type="button"
          onClick={() => setShowForm(true)}
          className="bg-[#D4A843] hover:bg-[#c9963e] text-black font-semibold"
        >
          <Plus size={18} className="mr-2" />
          Add Property
        </Button>
      )}
    </div>
  );
}
