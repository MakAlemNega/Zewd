import ClassicTemplate from "./ClassicTemplate";
import ModernTemplate from "./ModernTemplate";
import CulturalTemplate from "./CulturalTemplate";

export const TEMPLATE_REGISTRY = {
  "classic-ivory": {
    name: "Classic Ivory",
    description: "Traditional elegance with exquisite serif layout borders.",
    component: ClassicTemplate,
  },
  "modern-minimal": {
    name: "Modern Charcoal",
    description:
      "Sleek, avant-garde design using stunning minimalist high contrasts.",
    component: ModernTemplate,
  },
  "cultural-gold": {
    name: "Cultural Gold",
    description: "Premium Habesha layout balancing cultural pattern bands.",
    component: CulturalTemplate,
  },
};

export const TEMPLATE_LIST = Object.entries(TEMPLATE_REGISTRY).map(
  ([id, config]) => ({
    id,
    name: config.name,
    description: config.description,
  }),
);
