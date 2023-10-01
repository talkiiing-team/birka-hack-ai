echo "deploys new stand env\n"
cat ../.env.production
cat ../.env.production | base64 > .tmp
gh secret set STAND_COMPOSE_ENV < .tmp
rm .tmp
