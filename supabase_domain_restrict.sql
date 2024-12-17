BEGIN
    DECLARE
        allowed_domains text[] := ARRAY['insel.ch', 'hotmail.com', 'rolshoven.io']; -- Add more domains as needed
        email_domain text;
    BEGIN
        -- Extract the domain part of the email
        email_domain := substring(NEW.email FROM '@(.*)$');

        -- Check if the domain is in the allowed domains array
        IF email_domain IS NULL OR email_domain NOT IN (SELECT unnest(allowed_domains)) THEN
            RAISE EXCEPTION 'INCORRECT_DOMAIN';
        END IF;

        RETURN NEW;
    END;
END;

Create trigger:

CREATE TRIGGER
  check_user_domain_trigger
  before INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE
