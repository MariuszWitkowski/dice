import 'reflect-metadata';
import { container, Lifecycle } from 'tsyringe';
import ErrorHandler from './managers/ErrorHandler';
import ErrorDisplay from './managers/ErrorDisplay';
import { init, rollDice } from './dice';

// Register the dependencies with the container
container.register('ErrorDisplay', { useClass: ErrorDisplay }, { lifecycle: Lifecycle.Singleton });
container.register('ErrorHandler', { useClass: ErrorHandler }, { lifecycle: Lifecycle.Singleton });

// Get an instance of the error handler
const errorHandler = container.resolve(ErrorHandler);

// Set up a global error handler to catch unhandled exceptions
window.onerror = (message, source, lineno, colno, error) => {
  if (error) {
    errorHandler.addError(error);
  } else {
    // Create a synthetic error object if the browser doesn't provide one
    const syntheticError = new Error(message as string);
    syntheticError.stack = `${message}\n    at ${source}:${lineno}:${colno}`;
    errorHandler.addError(syntheticError);
  }
  // Prevent the default browser error handling
  return true;
};

// Wrap the main application logic in a try-catch block
try {
  init();
  const rollButton = document.getElementById('roll-button');
  if (rollButton) {
    rollButton.addEventListener('click', rollDice);
  } else {
    throw new Error("Could not find the 'roll-button' element.");
  }
} catch (error) {
  if (error instanceof Error) {
    errorHandler.addError(error);
  } else {
    errorHandler.addError(new Error(String(error)));
  }
}
