import ProviderLocation from '../../models/providerLocation';
import { AvailableTimeslot } from '../../models/api/availableTimesApiModels';

export type ProviderLocationWithAvailability = ProviderLocation & {
  availableSlots: Array<AvailableTimeslot>;
};
