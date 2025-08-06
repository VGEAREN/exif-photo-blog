import { useCallback, useState } from 'react';
import { streamAiImageQueryAction } from '../actions';
import { AiImageQuery } from '.';

export default function useAiImageQuery(
  imageBase64: string | undefined,
  query: AiImageQuery,
  existingTitle?: string,
) {
  const [text, setText] = useState('');
  const [error, setError] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  const request = useCallback(async () => {
    if (imageBase64) {
      setIsLoading(true);
      setText('');
      try {
        const response = await streamAiImageQueryAction(
          imageBase64,
          query,
          existingTitle,
        );
        setText(response ?? '');
        setIsLoading(false);
      } catch (e) {
        setError(e);
        setIsLoading(false);
      }
    }
  }, [imageBase64, query, existingTitle]);

  const reset = useCallback(() => {
    setText('');
    setError(undefined);
    setIsLoading(false);
  }, []);

  // Withhold text if it's a null response
  const isTextError = /^(I'*m )*sorry/i.test(text);

  return [
    request,
    isTextError ? '' : text,
    isLoading,
    reset,
    error,
  ] as const;
};
