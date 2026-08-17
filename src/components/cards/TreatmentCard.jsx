import { Link } from 'react-router-dom';
import SmartImage from '../ui/SmartImage.jsx';
import Badge from '../ui/Badge.jsx';
import Icon from '../ui/Icon.jsx';
import SaveButton from '../ui/SaveButton.jsx';
import { formatPriceRange } from '../../utils/format.js';

export default function TreatmentCard({ treatment }) {
  return (
    <Link
      to={`/treatments/${treatment.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div className="relative">
        <SmartImage
          src={treatment.image}
          alt={treatment.name}
          imgClassName="transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute right-3 top-3">
          <SaveButton type="treatment" id={treatment.id} floating />
        </div>
        <div className="absolute left-3 top-3">
          <Badge tone="brand" className="bg-white/90 backdrop-blur">
            {treatment.category}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold leading-snug text-ink-900 group-hover:text-brand-700">
          {treatment.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-ink-500">
          {treatment.shortDescription}
        </p>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-ink-500">
          <span className="flex items-center gap-1">
            <Icon name="clock" size={13} /> {treatment.duration}
          </span>
          <span className="flex items-center gap-1">
            <Icon name="building" size={13} /> {treatment.hospitalIds.length} hospitals
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-ink-100 pt-3">
          <div>
            <p className="text-xs text-ink-500">Estimated cost</p>
            <p className="text-sm font-semibold text-ink-900">
              {formatPriceRange(treatment.cost)}
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
            Details
            <Icon name="chevronRight" size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}
