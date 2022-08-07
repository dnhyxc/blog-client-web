import { detail } from '../../mock';

export const getMackdownById = (id: string | undefined) => {
  const res = detail.find((i) => i.id === id);
  return res;
};
