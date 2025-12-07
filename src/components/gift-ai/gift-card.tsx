import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { GiftSuggestion } from "@/lib/types"

// ... imports
import { useState } from "react"

const FALLBACK_IMAGES = [
  "/gift_fallback_1.png",
  "/gift_fallback_2.png",
  "/gift_fallback_3.png",
  "/gift_fallback_4.png",
  "/gift_fallback_5.png"
];

export function GiftCard({ suggestion }: { suggestion: GiftSuggestion }) {
  // Deterministic fallback based on title length to avoid hydration mismatch, or just random if client-side
  // Better: use title char code sum mod 5 for consistent fallback per product
  const fallbackIndex = suggestion.title.length % FALLBACK_IMAGES.length;
  const initialFallback = FALLBACK_IMAGES[fallbackIndex];
  
  const [imgSrc, setImgSrc] = useState(suggestion.imageUrl || initialFallback);

  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 overflow-hidden bg-gray-50 flex items-center justify-center p-4">
        <img 
            src={imgSrc} 
            alt={suggestion.title} 
            className="w-full h-full object-contain mix-blend-multiply" 
            onError={() => setImgSrc(initialFallback)}
        />
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
            <Badge variant="outline" className="mb-2">{suggestion.category}</Badge>
            <span className="text-sm font-semibold text-green-600">{suggestion.priceRange}</span>
        </div>
        <CardTitle className="text-lg leading-tight">{suggestion.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <p className="text-sm text-muted-foreground mb-2">{suggestion.description}</p>
        <div className="bg-yellow-50 p-2 rounded text-xs text-yellow-800 border border-yellow-100">
            💡 {suggestion.reason}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" asChild>
          <a href={suggestion.affiliateLink} target="_blank" rel="noopener noreferrer">
            View on Amazon <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
