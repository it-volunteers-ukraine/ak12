import { getTranslations } from 'next-intl/server'
import { getSubdivisions } from '@/actions/subdivisions'
import { SubdivisionCard } from './subdivision-card'
import { Locale } from '@/types'

interface SubdivisionsSectionProps {
  locale: Locale
}

/**
 * SubdivisionsSection - A server-side component that displays a localized list
 * of subdivisions. It uses getTranslations for asynchronous server-side i18n.
 */
export const SubdivisionsSection = async ({
  locale,
}: SubdivisionsSectionProps) => {
  // Fetching translations for the 'subdivisions' namespace on the server
  const t = await getTranslations({ locale, namespace: 'subdivisions' })
  
  // Fetching data from our JSON "database" via Server Action
  const subdivisions = await getSubdivisions(locale)

  if (!subdivisions.length) {
    return null
  }

  return (
    <section className="py-16 px-4 bg-slate-50" id="subdivisions">
      <div className="max-w-7xl mx-auto">
        {/* Title is now fully localized and no longer hardcoded */}
        <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center tracking-tight">
          {t('title')}
        </h2>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 list-none p-0">
          {subdivisions.map((subdivision) => (
            <li key={subdivision.id} className="h-full">
              <SubdivisionCard subdivision={subdivision} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}