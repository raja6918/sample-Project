import React from 'react';

export const TimelineContext = React.createContext();

/* High-order Component to Suscribe any component to the full context */
export function withTimelineContext(Component) {
  return function SuscribedComponent(props) {
    return (
      <TimelineContext.Consumer>
        {context => <Component {...props} context={context} />}
      </TimelineContext.Consumer>
    );
  };
}
