import { Link } from 'react-router-dom';
import SmartImage from '../ui/SmartImage.jsx';
import Rating from '../ui/Rating.jsx';
import Badge from '../ui/Badge.jsx';
import Icon from '../ui/Icon.jsx';
import SaveButton from '../ui/SaveButton.jsx';
import { formatFrom } from '../../utils/format.js';

export default function HospitalCard({ hospital }) {
  return (
    <Link
      to={`/hospitals/${hospital.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div className="relative">
        <SmartImage
          src={hospital.thumbnail}
          alt={hospital.name}
          imgClassName="transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute right-3 top-3">
          <SaveButton type="hospital" id={hospital.id} floating />
        </div>
        <div className="absolute left-3 top-3 flex gap-1.5">
          <Badge tone="neutral" className="bg-white/90 backdrop-blur capitalize">
            {hospital.type}
          </Badge>
          {hospital.internationalSupport && (
            <Badge tone="brand" className="bg-white/90 backdrop-blur">
              <Icon name="globe" size={12} /> International
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-snug text-ink-900 group-hover:text-brand-700">
            {hospital.name}
          </h3>
          <Rating value={hospital.rating} className="shrink-0" />
        </div>

        <p className="mt-1 flex items-center gap-1 text-sm text-ink-500">
          <Icon name="mapPin" size={14} />
          {hospital.city}, {hospital.state}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {hospital.specialties.slice(0, 3).map((s) => (
            <Badge key={s} tone="outline">
              {s}
            </Badge>
          ))}
          {hospital.specialties.length > 3 && (
            <Badge tone="outline">+{hospital.specialties.length - 3}</Badge>
          )}
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-ink-100 pt-3">
          <div>
            <p className="text-xs text-ink-500">Treatments</p>
            <p className="text-sm font-semibold text-ink-900">
              {formatFrom(hospital.priceRange)}
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
            View details
            <Icon name="chevronRight" size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}
