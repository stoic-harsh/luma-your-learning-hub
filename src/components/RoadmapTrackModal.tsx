import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Clock, Play } from 'lucide-react';

interface Checkpoint {
  id: string;
  title: string;
  description: string;
  duration: string;
  status: 'completed' | 'current' | 'upcoming';
}

interface RoadmapTrack {
  id: string;
  title: string;
  description: string;
  totalDuration: string;
  checkpoints: Checkpoint[];
}

interface RoadmapTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: RoadmapTrack | null;
}

const roadmapTracks: Record<string, RoadmapTrack> = {
  'iqvia-dataset': {
    id: 'iqvia-dataset',
    title: 'IQVIA Dataset',
    description: 'Master IQVIA pharmaceutical data analysis and reporting',
    totalDuration: '40 hours',
    checkpoints: [
      { id: '1', title: 'Introduction to IQVIA', description: 'Overview of IQVIA data sources and structure', duration: '4 hrs', status: 'upcoming' },
      { id: '2', title: 'Data Dictionary Deep Dive', description: 'Understanding key fields, codes, and classifications', duration: '6 hrs', status: 'upcoming' },
      { id: '3', title: 'Prescription Data Analysis', description: 'Analyzing Rx data for market insights', duration: '8 hrs', status: 'upcoming' },
      { id: '4', title: 'Claims Data Processing', description: 'Working with medical and pharmacy claims', duration: '8 hrs', status: 'upcoming' },
      { id: '5', title: 'Advanced Analytics & Reporting', description: 'Building dashboards and automated reports', duration: '10 hrs', status: 'upcoming' },
      { id: '6', title: 'Final Assessment', description: 'Capstone project and certification', duration: '4 hrs', status: 'upcoming' },
    ],
  },
  'data-engineering': {
    id: 'data-engineering',
    title: 'Data Engineering Fundamentals',
    description: 'Build scalable data pipelines and ETL processes',
    totalDuration: '50 hours',
    checkpoints: [
      { id: '1', title: 'Data Architecture Basics', description: 'Understanding data lakes, warehouses, and lakehouses', duration: '6 hrs', status: 'upcoming' },
      { id: '2', title: 'SQL Mastery', description: 'Advanced SQL for data transformations', duration: '8 hrs', status: 'upcoming' },
      { id: '3', title: 'Python for Data Engineering', description: 'Pandas, PySpark, and data manipulation', duration: '10 hrs', status: 'upcoming' },
      { id: '4', title: 'ETL Pipeline Design', description: 'Building robust extraction, transformation, and loading pipelines', duration: '10 hrs', status: 'upcoming' },
      { id: '5', title: 'Cloud Data Platforms', description: 'AWS, Azure, and GCP data services', duration: '10 hrs', status: 'upcoming' },
      { id: '6', title: 'Data Orchestration', description: 'Airflow, Prefect, and workflow management', duration: '6 hrs', status: 'upcoming' },
    ],
  },
  'dqm-qc': {
    id: 'dqm-qc',
    title: 'DQM / QC Framework',
    description: 'Implement data quality management and quality control processes',
    totalDuration: '35 hours',
    checkpoints: [
      { id: '1', title: 'DQM Fundamentals', description: 'Data quality dimensions and metrics', duration: '5 hrs', status: 'upcoming' },
      { id: '2', title: 'Quality Rules Engine', description: 'Designing and implementing validation rules', duration: '7 hrs', status: 'upcoming' },
      { id: '3', title: 'Anomaly Detection', description: 'Statistical methods for identifying data issues', duration: '6 hrs', status: 'upcoming' },
      { id: '4', title: 'QC Automation', description: 'Automating quality checks in pipelines', duration: '8 hrs', status: 'upcoming' },
      { id: '5', title: 'Reporting & Governance', description: 'Building quality dashboards and documentation', duration: '5 hrs', status: 'upcoming' },
      { id: '6', title: 'Case Studies', description: 'Real-world pharma data quality scenarios', duration: '4 hrs', status: 'upcoming' },
    ],
  },
};

export const getTrackById = (id: string): RoadmapTrack | null => {
  return roadmapTracks[id] || null;
};

export const RoadmapTrackModal = ({ isOpen, onClose, track }: RoadmapTrackModalProps) => {
  if (!track) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b border-border">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-xl mb-1">{track.title}</DialogTitle>
              <p className="text-sm text-muted-foreground">{track.description}</p>
            </div>
            <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1">
              <Clock className="h-3.5 w-3.5" />
              {track.totalDuration}
            </Badge>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-muted" />

            <div className="space-y-1">
              {track.checkpoints.map((checkpoint, index) => (
                <div
                  key={checkpoint.id}
                  className="relative flex gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {/* Status icon */}
                  <div className="relative z-10 flex-shrink-0">
                    {checkpoint.status === 'completed' ? (
                      <div className="h-10 w-10 rounded-full bg-success flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-success-foreground" />
                      </div>
                    ) : checkpoint.status === 'current' ? (
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center animate-pulse">
                        <Play className="h-5 w-5 text-primary-foreground" />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-muted border-2 border-border flex items-center justify-center">
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-medium text-sm">
                          {index + 1}. {checkpoint.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {checkpoint.description}
                        </p>
                      </div>
                      <Badge variant="muted" className="text-xs flex-shrink-0">
                        {checkpoint.duration}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="gradient">
            <Play className="h-4 w-4 mr-2" />
            Begin Track
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoadmapTrackModal;
