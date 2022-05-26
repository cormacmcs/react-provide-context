import * as React from 'react';
import ContextCreator, { assignMetaReducers } from './ContextCreator';

interface MultiProviderProps {
  providers: any[];
}
type Provider = ({ children }: { children: React.ReactNode }) => JSX.Element;

const createProvidersStack = (providers: Provider[], children, props, index: number = 0, childIsElement?: boolean) => {
  const isFinalNode = index === providers.length - 1;
  const component = providers[index];
  if (!isFinalNode) {
    return React.createElement(
      component,
      null,
      createProvidersStack(providers, children, props, ++index, childIsElement)
    );
  } else {
    if (!childIsElement) {
      return React.createElement(component, null, children);
    } else {
      if (!(typeof children === 'function')) {
        // I don't think memo is working if used this way, but it stops it from throwing an error, need to look into it in the future!!
        console.warn(
          'To use React.memo with ProvideContext wrap the ProvideContext HOC output with react memo, not the component being memoized'
        );
        return React.createElement(component, null, React.createElement(children.type, props, props.children));
      } else {
        return React.createElement(component, null, React.createElement(children, props, props.children));
      }
    }
  }
};

export const MultiProvider: React.FC<MultiProviderProps> = ({ providers, children }) => {
  return createProvidersStack(providers, children, {});
};

export const ProvideContext = (ProvideContext: Provider | Provider[]) => (Component: React.ReactNode) => (props) => {
  const providers = ProvideContext instanceof Array ? ProvideContext : [ProvideContext];
  return createProvidersStack(providers, Component, props, 0, true);
};
export const useMetaReducers = assignMetaReducers;

export default ContextCreator;
