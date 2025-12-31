import * as React from "react";
import { MapPin, Bed, Bath, Maximize, Star, Edit, Trash } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface PropertyCardProps {
  property: {
    id: string;
    image: string;
    title: string;
    location: string;
    price: number;
    type: "sale" | "rent";
    bedrooms: number;
    bathrooms: number;
    area: number;
    status: "active" | "pending" | "sold" | "archived";
    featured?: boolean;
  };
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
  className?: string;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onEdit,
  onDelete,
  onClick,
  className,
}) => {
  const statusVariantMap: Record<string, "success" | "warning" | "default"> = {
    active: "success",
    pending: "warning",
    sold: "default",
    archived: "default",
  };

  return (
    <Card
      className={cn(
        "group cursor-pointer hover:shadow-lg transition-shadow overflow-hidden",
        className
      )}
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {property.featured && (
            <Badge variant="warning" className="shadow-sm">
              <Star className="w-3 h-3" />
              Featured
            </Badge>
          )}
          <Badge
            variant={property.type === "sale" ? "primary" : "success"}
            className="shadow-sm"
          >
            For {property.type === "sale" ? "Sale" : "Rent"}
          </Badge>
        </div>

        {/* Actions */}
        {(onEdit || onDelete) && (
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm transition-colors"
                aria-label="Edit property"
              >
                <Edit className="w-4 h-4 text-neutral-700" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm text-error-600 transition-colors"
                aria-label="Delete property"
              >
                <Trash className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg line-clamp-1 flex-1">
            {property.title}
          </h3>
          <Badge variant={statusVariantMap[property.status]} className="ml-2">
            {property.status}
          </Badge>
        </div>

        <div className="flex items-center gap-1 text-sm text-neutral-500 mb-3">
          <MapPin className="w-4 h-4" />
          <span className="line-clamp-1">{property.location}</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            ${property.price.toLocaleString()}
            {property.type === "rent" && (
              <span className="text-sm font-normal text-neutral-500">/mo</span>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize className="w-4 h-4" />
            <span>{property.area} sqft</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
