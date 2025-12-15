-- Create enum for employee roles
CREATE TYPE public.employee_role AS ENUM (
  'Intern',
  'Programmer Analyst Trainee',
  'Programmer Analyst',
  'Business/Technology Analyst',
  'Senior Analyst',
  'AEL',
  'EL',
  'SEL',
  'Director',
  'Executive Director'
);

-- Create enum for office locations
CREATE TYPE public.office_location AS ENUM (
  'Cyber Greens, Gurgaon',
  'Managed Services, Gurgaon',
  'Analytics Office, Pune'
);

-- Create enum for app roles (admin vs regular user)
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create enum for course request status
CREATE TYPE public.course_request_status AS ENUM ('pending', 'approved', 'rejected');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  employee_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  employee_role employee_role NOT NULL DEFAULT 'Intern',
  office_location office_location NOT NULL DEFAULT 'Cyber Greens, Gurgaon',
  manager_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from employee roles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create project_groups table
CREATE TABLE public.project_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project_group_members table
CREATE TABLE public.project_group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.project_groups(id) ON DELETE CASCADE NOT NULL,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (group_id, profile_id)
);

-- Create email_templates table
CREATE TABLE public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  cc TEXT,
  bcc TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create course_requests table
CREATE TABLE public.course_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  course_name TEXT NOT NULL,
  course_provider TEXT NOT NULL,
  course_url TEXT,
  estimated_cost DECIMAL(10,2),
  reason TEXT,
  status course_request_status NOT NULL DEFAULT 'pending',
  manager_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewer_notes TEXT,
  proof_of_completion TEXT,
  reimbursement_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_requests ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get profile by user_id
CREATE OR REPLACE FUNCTION public.get_profile_by_user_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.profiles WHERE user_id = _user_id LIMIT 1
$$;

-- RLS Policies for profiles
CREATE POLICY "Admins can do everything on profiles"
ON public.profiles FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Managers can view their team profiles"
ON public.profiles FOR SELECT TO authenticated
USING (manager_id = public.get_profile_by_user_id(auth.uid()));

-- RLS Policies for user_roles
CREATE POLICY "Admins can manage user_roles"
ON public.user_roles FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- RLS Policies for project_groups
CREATE POLICY "Admins can manage project_groups"
ON public.project_groups FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can view project_groups"
ON public.project_groups FOR SELECT TO authenticated
USING (true);

-- RLS Policies for project_group_members
CREATE POLICY "Admins can manage project_group_members"
ON public.project_group_members FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can view project_group_members"
ON public.project_group_members FOR SELECT TO authenticated
USING (true);

-- RLS Policies for email_templates
CREATE POLICY "Admins can manage email_templates"
ON public.email_templates FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can view email_templates"
ON public.email_templates FOR SELECT TO authenticated
USING (true);

-- RLS Policies for course_requests
CREATE POLICY "Admins can manage all course_requests"
ON public.course_requests FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own course_requests"
ON public.course_requests FOR SELECT TO authenticated
USING (requester_id = public.get_profile_by_user_id(auth.uid()));

CREATE POLICY "Users can create course_requests"
ON public.course_requests FOR INSERT TO authenticated
WITH CHECK (requester_id = public.get_profile_by_user_id(auth.uid()));

CREATE POLICY "Users can update their own pending course_requests"
ON public.course_requests FOR UPDATE TO authenticated
USING (requester_id = public.get_profile_by_user_id(auth.uid()) AND status = 'pending');

CREATE POLICY "Managers can view team course_requests"
ON public.course_requests FOR SELECT TO authenticated
USING (manager_id = public.get_profile_by_user_id(auth.uid()));

CREATE POLICY "Managers can update team course_requests"
ON public.course_requests FOR UPDATE TO authenticated
USING (manager_id = public.get_profile_by_user_id(auth.uid()));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_groups_updated_at
BEFORE UPDATE ON public.project_groups
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at
BEFORE UPDATE ON public.email_templates
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_requests_updated_at
BEFORE UPDATE ON public.course_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default email template for course requests
INSERT INTO public.email_templates (name, subject, body, cc, bcc)
VALUES (
  'Course Approval Request',
  'Course Approval Request - {course_name}',
  'Dear {manager_name},

I would like to request approval for the following course:

Course Name: {course_name}
Provider: {course_provider}
Estimated Cost: {estimated_cost}
Course URL: {course_url}

Reason for taking this course:
{reason}

Please review and approve this request.

Best regards,
{employee_name}
{employee_id}',
  '',
  ''
);