DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;

DROP POLICY IF EXISTS "No direct access to studio settings" ON public.studio_settings;
CREATE POLICY "No direct access to studio settings"
ON public.studio_settings
FOR ALL
TO authenticated
USING (false)
WITH CHECK (false);