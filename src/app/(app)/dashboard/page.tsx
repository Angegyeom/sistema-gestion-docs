import React from 'react';

const steps = [
  { step: 1, title: 'PLANIFICACIÓN', status: 'completed' },
  { step: 2, title: 'MÉTODOS Y DOCUMENTOS', status: 'completed' },
  { step: 3, title: 'SEGMENTACIÓN Y RUTEO', status: 'completed' },
  { step: 4, title: 'CONSECUCIÓN DE RRHH', status: 'active' },
  { step: 5, title: 'LOGÍSTICA CENSAL', status: 'active' },
  { step: 6, title: 'CAPACITACIÓN', status: 'pending' },
  { step: 7, title: 'OPERACIÓN DE CAMPO (Captura)(Segmentación)', status: 'pending' },
  { step: 8, title: 'PROCESAMIENTO DE DATOS (Consistencia)', status: 'pending' },
  { step: 9, title: 'PUBLICACIÓN Y RESULTADOS', status: 'pending' },
  { step: 10, title: 'ENCUESTA POST CENSAL', status: 'pending' },
];

const phaseLabels = [
    { label: 'PLANIFICACIÓN', className: 'bg-red-500' },
    { label: 'CENSO EXPERIMENTAL', className: 'bg-orange-500' },
    { label: 'CENSO', className: 'bg-orange-500' },
    { label: 'POST-CENSO', className: 'bg-orange-500' },
]

const Step = ({ step, title, status }) => {
  let statusClasses = '';
  switch (status) {
    case 'completed':
      statusClasses = 'bg-green-500';
      break;
    case 'active':
      statusClasses = 'bg-blue-500 animate-pulse';
      break;
    case 'pending':
      statusClasses = 'bg-gray-400';
      break;
  }

  return (
    <div className="flex flex-col items-center relative z-10 w-32">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-lg mb-4 shadow-lg ${statusClasses}`}>
        {step}
      </div>
      <div className={`text-center bg-white p-3 rounded-lg shadow-md min-h-[60px] flex items-center border-2 ${status === 'completed' ? 'border-green-500 bg-green-50' : status === 'active' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}>
        <div className="text-xs font-semibold leading-tight text-gray-800">{title}</div>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto p-5 md:p-10">
      <div className="text-center text-white mb-12">
        <h1 className="text-4xl md:text-5xl mb-2.5 text-shadow">CENSO DE POBLACIÓN Y VIVIENDA 2025</h1>
        <p className="text-xl md:text-2xl opacity-90">Sistema Integral de Gestión Censal</p>
      </div>

      <div className="bg-white/95 rounded-2xl p-5 md:p-10 mb-10 shadow-2xl">
        <div className="relative overflow-hidden">
          <div className="hidden md:flex justify-between mb-10 px-12">
            {phaseLabels.map(phase => (
                 <div key={phase.label} className={`font-bold text-sm py-2 px-4 rounded-full text-white text-center min-w-[120px] ${phase.className}`}>
                    {phase.label}
                 </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between relative my-10 gap-y-8">
            <div className="hidden md:block absolute top-1/2 left-[5%] right-[5%] h-1.5 bg-gradient-to-r from-red-500 via-gray-400 to-yellow-500 rounded-full z-0" />
            <div className="flex flex-wrap justify-center gap-4 md:gap-0 md:justify-between w-full">
              {steps.map(s => (
                <Step key={s.step} step={s.step} title={s.title} status={s.status} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
