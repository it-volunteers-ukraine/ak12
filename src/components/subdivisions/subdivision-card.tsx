import Image from 'next/image' 
import { Subdivision } from '@/types'

interface SubdivisionCardProps {
  subdivision: Subdivision
}

export const SubdivisionCard = ({ subdivision }: SubdivisionCardProps) => {
  return (
    <article className="flex flex-col h-full border border-slate-200 rounded-lg overflow-hidden bg-white transition-shadow hover:shadow-md">
     
      <div className="relative h-48 w-full bg-slate-100">
        <Image
          src={subdivision.imageUrl}
          alt={`Фото підрозділу: ${subdivision.name}`}
          fill 
          className="object-cover" 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
          priority={subdivision.sortOrder <= 3} 
          loading={subdivision.sortOrder > 3 ? "lazy" : "eager"} 
        />
      </div>

      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          {subdivision.name}
        </h3>

        <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
          {subdivision.description}
        </p>

        {subdivision.siteUrl && (
          <div className="mt-auto pt-4 border-t border-slate-100">
            <a
              href={subdivision.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-semibold text-blue-700 hover:text-blue-800 transition-colors group"
            >
              Відвідати сайт підрозділу
              <svg 
                className="ml-1.5 w-4 h-4 transition-transform group-hover:translate-x-0.5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                />
              </svg>
            </a>
          </div>
        )}
      </div>
    </article>
  )
}