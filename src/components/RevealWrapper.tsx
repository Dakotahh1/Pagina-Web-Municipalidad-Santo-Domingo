import React, { useEffect, useRef, useState, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  delay?: number;    //retraso en ms para animar elementos en cascada (ej: tarjetas de un grid)
  className?: string;
}

/*componente que envuelve cualquier elemento y lo hace aparecer con fade + slide-up
  cuando entra espacio de visión. una vez visible no vuelve a animarse (disconnect).

  uso básico:
    <RevealWrapper>
      <MiComponente />
    </RevealWrapper>

  con cascada en un grid:
    {items.map((item, i) => (
      <RevealWrapper key={i} delay={i * 100}>
        <Tarjeta />
      </RevealWrapper>
    ))}*/

const RevealWrapper: React.FC<Props> = ({ children, delay = 0, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    //el rootMargin negativo hace que la animación empiece cuando el elemento
    //está a punto de entrar, no justo cuando toca el borde inferior de pantalla
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -40px 0px', threshold: 0.08 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-500 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default RevealWrapper;
