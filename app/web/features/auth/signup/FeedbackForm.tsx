import * as Sentry from "@sentry/react";
import ContributorForm from "components/ContributorForm";
import { useAuthContext } from "features/auth/AuthProvider";
import { useTranslation } from "i18n";
import { GLOBAL } from "i18n/namespaces";
import { ContributorForm as ContributorFormPb } from "proto/auth_pb";
import { service } from "service";
import isGrpcError from "utils/isGrpcError";

export default function FeedbackForm() {
  const { t } = useTranslation(GLOBAL);
  const { authActions, authState } = useAuthContext();

  const handleSubmit = async (form: ContributorFormPb.AsObject) => {
    authActions.clearError();
    try {
      const res = await service.auth.signupFlowFeedback(
        authState.flowState!.flowToken,
        form
      );
      authActions.updateSignupState(res);
    } catch (err) {
      Sentry.captureException(err, {
        tags: {
          component: "auth/signup/feedbackForm",
        },
      });
      authActions.authError(
        isGrpcError(err) ? err.message : t("error.fatal_message")
      );
    }
    window.scroll({ top: 0, behavior: "smooth" });
  };

  return <ContributorForm processForm={handleSubmit} autofocus />;
}
