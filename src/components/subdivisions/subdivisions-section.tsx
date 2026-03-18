import { Locale } from '@/types'
import { getSubdivisions } from '@/actions/subdivisions'
import { SubdivisionCard } from './subdivision-card'

interface SubdivisionsSectionProps {
  locale: Locale
}

export const SubdivisionsSection = async ({
  locale,
}: SubdivisionsSectionProps) => {
  const subdivisions = await getSubdivisions(locale)

  if (!subdivisions.length) {
    return null
  }

  return (
    <section className="py-16 px-4 bg-slate-50" id="subdivisions">
          <div className="max-w-7xl mx-auto">
         {/* TODO: replace with t('title') when i18n keys are added */}     
        <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center tracking-tight">
          {locale === 'uk' ? 'Наші підрозділи' : 'Our Units'}
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