REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_admin_bootstrap() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;

DROP POLICY IF EXISTS "Admins can read studio settings" ON public.studio_settings;
DROP POLICY IF EXISTS "Admins can update studio settings" ON public.studio_settings;
DROP POLICY IF EXISTS "Admins can insert studio settings" ON public.studio_settings;

REVOKE SELECT, INSERT, UPDATE, DELETE ON public.studio_settings FROM anon, authenticated;