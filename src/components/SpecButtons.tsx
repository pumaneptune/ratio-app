import { Download, ExternalLink } from 'lucide-react';

interface SpecButtonsProps {
  size?: 'sm' | 'xs';
  className?: string;
  layout?: 'row' | 'wrap';
}

export function SpecButtons({ size = 'sm', className = '', layout = 'wrap' }: SpecButtonsProps) {
  const handleRunInPostman = () => {
    const url = `${window.location.origin}/postman_collection.json`;
    window.open(
      `https://app.getpostman.com/run-collection/?data=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const pad = size === 'xs'
    ? 'px-2 py-1 text-[10px] gap-1 rounded-lg'
    : 'px-3 py-2 text-xs gap-1.5 rounded-xl';

  const base = `inline-flex items-center font-mono font-medium transition-all ${pad}`;
  const ghost = `${base} glass-card hover:border-white/[0.14] text-gray-500 hover:text-gray-200`;
  const postman = `${base} border border-[#ef5b25]/30 bg-[#ef5b25]/[0.06] text-[#ef5b25]/70 hover:text-[#ef5b25] hover:border-[#ef5b25]/50 hover:bg-[#ef5b25]/[0.09]`;

  return (
    <div className={`flex ${layout === 'wrap' ? 'flex-wrap' : ''} items-center gap-2 ${className}`}>
      <a
        href="/openapi.json"
        download="verifyproceed-openapi.json"
        className={ghost}
      >
        <Download className={size === 'xs' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
        OpenAPI Spec
      </a>

      <button onClick={handleRunInPostman} className={postman}>
        <ExternalLink className={size === 'xs' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
        Run in Postman
      </button>

      <a
        href="/postman_collection.json"
        download="verifyproceed-postman-collection.json"
        className={ghost}
      >
        <Download className={size === 'xs' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
        Postman Collection
      </a>
    </div>
  );
}
