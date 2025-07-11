-- Create tables for OnConect platform

-- Table for clinic partnerships
CREATE TABLE public.clinic_partnerships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  clinic_name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  city TEXT,
  additional_info TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for demo submissions
CREATE TABLE public.demo_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name TEXT NOT NULL,
  patient_age INTEGER,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  language TEXT DEFAULT 'uz' CHECK (language IN ('uz', 'ru', 'en')),
  medical_history TEXT,
  lab_results TEXT,
  oncologist_report TEXT,
  file_urls TEXT[], -- Array to store uploaded file URLs
  translated_report TEXT, -- English translation
  structured_report JSONB, -- Structured data
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'processing', 'translated', 'reviewed', 'sent_to_oncologist', 'completed')),
  assigned_oncologist TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for admin users
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for US oncologists
CREATE TABLE public.us_oncologists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  specialty TEXT,
  hospital_affiliation TEXT,
  license_number TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.clinic_partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.us_oncologists ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for form submissions)
CREATE POLICY "Anyone can submit clinic partnerships" 
ON public.clinic_partnerships 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can submit demo submissions" 
ON public.demo_submissions 
FOR INSERT 
WITH CHECK (true);

-- Create policies for admin access
CREATE POLICY "Admins can view all clinic partnerships" 
ON public.clinic_partnerships 
FOR SELECT 
USING (true); -- We'll handle admin auth in the application layer

CREATE POLICY "Admins can update clinic partnerships" 
ON public.clinic_partnerships 
FOR UPDATE 
USING (true);

CREATE POLICY "Admins can view all demo submissions" 
ON public.demo_submissions 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can update demo submissions" 
ON public.demo_submissions 
FOR UPDATE 
USING (true);

CREATE POLICY "Admins can view admin users" 
ON public.admin_users 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can view oncologists" 
ON public.us_oncologists 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage oncologists" 
ON public.us_oncologists 
FOR ALL 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_clinic_partnerships_updated_at
  BEFORE UPDATE ON public.clinic_partnerships
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_demo_submissions_updated_at
  BEFORE UPDATE ON public.demo_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_us_oncologists_updated_at
  BEFORE UPDATE ON public.us_oncologists
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample admin user (username: admin, password: onconect2024)
INSERT INTO public.admin_users (username, password_hash, email, role) 
VALUES ('admin', '$2b$10$rQJ8K8gIGwGZJ9nF8XnDEelR.T/zY2kQ.mF3J9nF8XnDEelR.T/zY2', 'admin@onconect.org', 'super_admin');

-- Insert sample US oncologists
INSERT INTO public.us_oncologists (name, email, specialty, hospital_affiliation) 
VALUES 
  ('Dr. Sarah Johnson', 'sarah.johnson@memorialsloan.org', 'Medical Oncology', 'Memorial Sloan Kettering Cancer Center'),
  ('Dr. Michael Chen', 'michael.chen@mdanderson.org', 'Radiation Oncology', 'MD Anderson Cancer Center'),
  ('Dr. Emily Rodriguez', 'emily.rodriguez@mayoclinic.org', 'Surgical Oncology', 'Mayo Clinic');

-- Create storage bucket for demo file uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('demo-files', 'demo-files', false);

-- Create storage policies for demo files
CREATE POLICY "Anyone can upload demo files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'demo-files');

CREATE POLICY "Anyone can view demo files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'demo-files');