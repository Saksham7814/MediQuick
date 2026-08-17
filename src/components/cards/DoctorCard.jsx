import { Link } from 'react-router-dom';
import SmartImage from '../ui/SmartImage.jsx';
import Rating from '../ui/Rating.jsx';
import Icon from '../ui/Icon.jsx';
import { StatusBadge } from '../ui/Badge.jsx';
import SaveButton from '../ui/SaveButton.jsx';

export default function DoctorCard({ doctor, hospitalName }) {
  return (
    <Link
      to={`/doctors/${doctor.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div className="relative">
        <SmartImage
          src={doctor.image}
          alt={doctor.name}
          aspect="aspect-[4/3]"
          imgClassName="object-top transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute right-3 top-3">
          <SaveButton type="doctor" id={doctor.id} floating />
        </div>
        <div className="absolute left-3 top-3">
          <StatusBadge status={doctor.availability} className="bg-white/90 backdrop-blur" />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-snug text-ink-900 group-hover:text-brand-700">
            {doctor.name}
          </h3>
          <Rating value={doctor.rating} className="shrink-0" />
        </div>
        <p className="mt-0.5 text-sm font-medium text-brand-700">
          {doctor.specialty}
        </p>

        <div className="mt-3 space-y-1.5 text-sm text-ink-500">
          <p className="flex items-center gap-1.5">
            <Icon name="award" size={14} /> {doctor.experienceYears} yrs experience
          </p>
          {hospitalName && (
            <p className="flex items-center gap-1.5">
              <Icon name="building" size={14} /> {hospitalName}
            </p>
          )}
          <p className="flex items-center gap-1.5">
            <Icon name="mapPin" size={14} /> {doctor.city}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-3">
          <span className="text-xs text-ink-500">
            Next: <span className="font-medium text-ink-800">{doctor.nextAvailable}</span>
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
            View profile
            <Icon name="chevronRight" size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}
