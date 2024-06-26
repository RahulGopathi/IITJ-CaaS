from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from main.models import Project, Resources, LinkedResources


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token["username"] = user.username
        token["email"] = user.email
        # ...
        return token


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ("username", "password", "password2")

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )

        return attrs

    def create(self, validated_data):
        user = User.objects.create(username=validated_data["username"])

        user.set_password(validated_data["password"])
        user.save()

        return user


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = "__all__"
        read_only_fields = ["owner", "created_at", "updated_at"]


class ResourcesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resources
        fields = "__all__"
        read_only_fields = ["owner", "project", "created_at", "updated_at"]


class LinkedResourcesSerializer(serializers.ModelSerializer):
    class Meta:
        model = LinkedResources
        fields = "__all__"
        read_only_fields = ["owner", "project", "resource", "created_at", "updated_at"]
