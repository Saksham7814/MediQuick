import { useState } from 'react';
import HospitalCard from '../components/cards/HospitalCard.jsx';
import DoctorCard from '../components/cards/DoctorCard.jsx';
import TreatmentCard from '../components/cards/TreatmentCard.jsx';
import Tabs from '../components/ui/Tabs.jsx';
import Button from '../components/ui/Button.jsx';
import { EmptyState, ErrorState } from '../components/ui/States.jsx';
import { CardGridSkeleton } from '../components/ui/Skeleton.jsx';
import { useApp } from '../context/AppContext.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { getHospitals, getDoctors, getTreatments } from '../services/api.js';

const loadAll = () =>
  Promise.all([getHospitals(), getDoctors(), getTreatments()]).then(
    ([hospitals, doctors, treatments]) => ({ hospitals, doctors, treatments })
  );

export default function Saved() {
  const { saved } = useApp();
  const { data, loading, error, retry } = useAsync(loadAll, []);
  const [tab, setTab] = useState('hospital');

  const hospitals = (data?.hospitals || []).filter((h) =>
    saved.hospital.includes(h.id)
  );
  const doctors = (data?.doctors || []).filter((d) => saved.doctor.includes(d.id));
  const treatments = (data?.treatments || []).filter((t) =>
    saved.treatment.includes(t.id)
  );
  const hospitalName = (id) => (data?.hospitals || []).find((h) => h.id === id)?.name;

  const tabs = [
    { value: 'hospital', label: 'Hospitals', count: saved.hospital.length },
    { value: 'doctor', label: 'Doctors', count: saved.doctor.length },
    { value: 'treatment', label: 'Treatments', count: saved.treatment.length },
  ];

  return (
    <div className="container-content py-10">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
          Saved
        </h1>
        <p className="mt-2 text-ink-500">
          Your shortlisted hospitals, doctors and treatments.
        </p>
      </header>

      <div className="mb-7 overflow-x-auto no-scrollbar">
        <Tabs tabs={tabs} value={tab} onChange={setTab} />
      </div>

      {loading ? (
        <CardGridSkeleton count={3} />
      ) : error ? (
        <ErrorState description="We couldn't load your saved items." onRetry={retry} />
      ) : (
        <>
          {tab === 'hospital' &&
            (hospitals.length ? (
              <Grid>
                {hospitals.map((h) => (
                  <HospitalCard key={h.id} hospital={h} />
                ))}
              </Grid>
            ) : (
              <SavedEmpty
                title="No saved hospitals yet"
                to="/hospitals"
                label="Browse hospitals"
              />
            ))}

          {tab === 'doctor' &&
            (doctors.length ? (
              <Grid>
                {doctors.map((d) => (
                  <DoctorCard key={d.id} doctor={d} hospitalName={hospitalName(d.hospitalId)} />
                ))}
              </Grid>
            ) : (
              <SavedEmpty
                title="No saved doctors yet"
                to="/doctors"
                label="Browse doctors"
              />
            ))}

          {tab === 'treatment' &&
            (treatments.length ? (
              <Grid>
                {treatments.map((t) => (
                  <TreatmentCard key={t.id} treatment={t} />
                ))}
              </Grid>
            ) : (
              <SavedEmpty
                title="No saved treatments yet"
                to="/treatments"
                label="Browse treatments"
              />
            ))}
        </>
      )}
    </div>
  );
}

function Grid({ children }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  );
}

function SavedEmpty({ title, to, label }) {
  return (
    <EmptyState
      icon="heart"
      title={title}
      description="Tap the heart on any card to save it here for later."
      action={<Button to={to}>{label}</Button>}
    />
  );
}
