export const metadata = {
  title: 'Navrasa Timeline | aigaane.in',
  description: 'Five-panel Piṅgala chronology with locked mātrā counts',
};

export default function NavrasaPage() {
  return (
    <iframe
      title="Navrasa Timeline Explorer"
      src="/navrasa.html"
      style={{ border: 0, width: '100%', minHeight: '100vh', background: '#080E18' }}
    />
  );
}
