import { motion, AnimatePresence } from 'framer-motion';
import { useDocs } from '../hooks/useDocs';
import { Rocket, Brain, Network, Microscope } from 'lucide-react';

import Intro from '../docs/sections/01-que-es-una-red.mdx';
import ML from '../docs/sections/02-tipos-de-aprendizaje.mdx';
import Tipos from '../docs/sections/03-que-es-una-neurona.mdx';
import Anatomia from '../docs/sections/04-anatomia-neurona.mdx';

const ContentMap: Record<string, any> = {
  '01': Intro, '02': ML, '03': Tipos, '04': Anatomia
};

const SectionFromFileLink: Record<string, string> = {
  '01-que-es-una-red': '01',
  '02-tipos-de-aprendizaje': '02',
  '03-que-es-una-neurona': '03',
  '04-anatomia-neurona': '04'
};

const resolveSectionFromHref = (href: string) => {
  const normalizedHref = decodeURIComponent(href).toLowerCase();

  const linkedFile = Object.keys(SectionFromFileLink).find((key) => normalizedHref.includes(key));
  if (linkedFile) {
    return SectionFromFileLink[linkedFile];
  }

  if (!normalizedHref.startsWith('#')) {
    return undefined;
  }

  const hash = normalizedHref.slice(1);

  if (hash.includes('machine-learning')) return '02';
  if (hash.includes('aprendizaje-profundo') || hash.includes('deep-learning')) return '04';
  if (hash.includes('neurona') || hash.includes('pesos') || hash.includes('sesgos')) return '04';
  if (hash.includes('tipos-de-redes')) return '03';
  if (hash.includes('funciones-de-activacion') || hash.includes('funciones-de-activación')) return '04';

  return undefined;
};

const IconMap: any = { Rocket, Brain, Network, Microscope };

const Docs = () => {
  const { activeId, changeSection, sections } = useDocs();
  const ActiveContent = ContentMap[activeId];
  const components = {
    a: ({ href = '', children, ...props }: any) => {
      const anchorText = String(children).toLowerCase();
      const linkedSection = resolveSectionFromHref(href)
        ?? (!href && anchorText.includes('deep learning') ? '04' : undefined);

      const onClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (!linkedSection) return;
        event.preventDefault();
        changeSection(linkedSection);
      };

      return (
        <a href={href || '#'} onClick={onClick} {...props}>
          {children}
        </a>
      );
    }
  };

  return (
    <div className="h-screen flex bg-white overflow-x-hidden">
      <aside className="w-72 bg-gray-900 border-r border-[#30363d] p-6 hidden lg:block lg:sticky lg:top-0 lg:h-screen lg:self-start max">
        <nav className="space-y-1">
          {sections.map((s) => {
            const Icon = IconMap[s.icon];
            return (
              <button
                key={s.id}
                onClick={() => changeSection(s.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${
                  activeId === s.id ? 'bg-blue-500/10 text-blue-400 border-l-2 border-blue-500' : 'text-[#8b949e] hover:text-white'
                }`}
              >
                <Icon size={16} /> {s.title}
              </button>
            );
          })}        </nav>
      </aside>

      <main className="flex-1 min-w-0 w-full max-h-screen bg-white overflow-hidden ">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="prose max-w-none p-16 overflow-y-auto h-[calc(100vh-128px)]">
                  <ActiveContent components={components} />
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Docs;