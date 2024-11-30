import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon, MapPinIcon, Star, Tag } from 'lucide-react'

export function ActivityCard({
  title,
  image,
  rating,
  reviewCount,
  date,
  location,
  categories,
  price,
  onBookClick
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex">
          <div className="w-1/3">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-2/3 p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-semibold mb-2">{title}</h2>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">{reviewCount} reviews</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon">
                  <CalendarIcon className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </Button>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <CalendarIcon className="h-4 w-4 mr-2" />
              {date}
            </div>
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <MapPinIcon className="h-4 w-4 mr-2" />
              {location}
            </div>
            <div className="flex items-center gap-2 mb-4">
              {categories.map((category, index) => (
                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <Tag className="h-3 w-3 mr-1" />
                  {category}
                </span>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">{price.toFixed(2)} USD</span>
              <Button onClick={onBookClick}>Book Activity</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

